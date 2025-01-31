const NotificationModel = require("../models/notification.model");
const ReportModel = require("../models/report.model");
const DeviceModel = require("../models/dispositivo.model");
const asyncErrorHandler = require("../utils/async-error-handler");
const admin = require("../config/firebase-admin");

const notificationController = {
  getAllMine: asyncErrorHandler(async (req, res) => {
    const user = req.user;

    const params = {};
    if(!user?.isAdmin){
      params.usuario_id = user.id;
    }

    const notifications = await NotificationModel.findAll({
      where: { ...params }, // Cambiado de userId a usuario_id
      include: [
        {
          model: ReportModel,
          as: 'reporte' // Asegúrate de que este alias coincida con tu modelo
        }
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(notifications);
  }),

  countPending: asyncErrorHandler(async (req, res) => {
    const user = req.user;

    const count = await NotificationModel.count({
      where: { 
        usuario_id: user.id, // Cambiado de userId a usuario_id
        leida: false  // Cambiado de read a leida
      },
    });

    res.status(200).json({ count });
  }),

  markAllAsRead: asyncErrorHandler(async (req, res) => {
    const user = req.user;
    
    await NotificationModel.update(
      { leida: true },  // Cambiado de read a leida
      { where: { usuario_id: user.id } } // Cambiado de userId a usuario_id
    );

    res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
  }),

  guardarTokenFCM: asyncErrorHandler(async (req, res) => {
    const user = req.user;
    const { token, platform } = req.body;

    try {
      // Usar upsert para actualizar o crear el token
      await DeviceModel.upsert({ 
        usuario_id: user.id, // Asegúrate de que este campo coincida con tu modelo
        token,
        platform
      });

      // Intentar enviar una notificación de prueba
      await notificationController.sendPushNotification(
        user.id,
        "Notificación de prueba",
        "Tu dispositivo ha sido registrado exitosamente para recibir notificaciones."
      );

      res.status(200).json({ message: "Token FCM guardado exitosamente" });
    } catch (error) {
      console.error("Error al guardar token FCM:", error);
      res.status(500).json({ message: "Error al guardar el token FCM" });
    }
  }),

  // Función de utilidad para enviar notificaciones push
  sendPushNotification: async (userId, title, message, data = {}) => {
    try {
      const device = await DeviceModel.findOne({
        where: { usuario_id: userId }, // Cambiado de userId a usuario_id
      });

      if (!device || !device.token) {
        console.error("No se encontró token FCM para el usuario");
        return;
      }

      const notificationMessage = {
        notification: {
          title,
          body: message,
        },
        token: device.token,
        data
      };

      const response = await admin.messaging().send(notificationMessage);
      console.log("Notificación enviada exitosamente:", response);
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  }
};

module.exports = notificationController;