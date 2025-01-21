const NotificationModel = require("../models/notification.model");
const ReportModel = require("../models/report.model");
const asyncErrorHandler = require("../utils/async-error-handler");

const notificationController = {
  getAllMine: asyncErrorHandler(async (req, res) => {
    const user = req.user;

    const notifications = await NotificationModel.findAll({
      where: { usuarioId: user.id },
      include: [ReportModel],
      order: [["id", "DESC"]],
    });

    res.status(200).json(notifications);
  }),
  countPending: asyncErrorHandler(async (req, res) => {
    const user = req.user;

    const count = await NotificationModel.count({
      where: { usuarioId: user.id, leida: false },
    });

    res.status(200).json({ count });
  }),
  markAllAsRead: asyncErrorHandler(async (req, res) => {
    const user = req.user;
    await NotificationModel.update(
      { leida: true },
      { where: { usuarioId: user.id } }
    );
    res
      .status(200)
      .json({ message: "notificaciones marcadas como leídas éxitosamente" });
  }),
};

module.exports = notificationController;
