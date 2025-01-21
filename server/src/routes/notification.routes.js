const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth");
const notificationController = require("../controllers/notifcation.controller");

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

module.exports = notificationRouter;
