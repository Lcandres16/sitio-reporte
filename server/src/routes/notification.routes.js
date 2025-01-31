const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth");
const notificationController = require('../controllers/notification.controller');

const notificationRouter = Router();

notificationRouter
  .route("/")
  .get(verifyToken, notificationController.getAllMine);

notificationRouter
  .route("/count-pending")
  .get(verifyToken, notificationController.countPending);

notificationRouter
  .route("/mark-all-as-read")
  .patch(verifyToken, notificationController.markAllAsRead);

// Nueva ruta para guardar el token FCM
notificationRouter
  .route("/guardar-token")
  .post(verifyToken, notificationController.guardarTokenFCM);

module.exports = notificationRouter;