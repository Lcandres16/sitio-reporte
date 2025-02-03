const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const NotificationModel = sequelize.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      // Cambiado de usuarioId
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usuario_id",
    },
    reportId: {
      // Cambiado de reporteId
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "reporte_id",
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    leida: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    created_at: {
      // Cambiado de createdAt
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notificaciones",
    timestamps: false,
    underscored: true,
  }
);

module.exports = NotificationModel;
