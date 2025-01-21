const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const NotificationModel = sequelize.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER(),
      field: "usuario_id",
    },
    reporteId: {
      type: DataTypes.INTEGER(),
      field: "reporte_id",
    },
    tipo: {
      type: DataTypes.STRING(),
    },
    leida: {
      type: DataTypes.BOOLEAN(),
    },
    createdAt: {
      type: DataTypes.TIME(),
      field: "created_at",
    },
  },
  { timestamps: false }
);

module.exports = NotificationModel;
