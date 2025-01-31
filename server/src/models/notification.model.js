const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const NotificationModel = sequelize.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {  // Cambiado de usuarioId
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reporte_id: {  // Cambiado de reporteId
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    leida: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    created_at: {  // Cambiado de createdAt
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'notificaciones',
    timestamps: false,
    underscored: true
  }
);

module.exports = NotificationModel;