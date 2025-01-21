const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const NotificationModel = require("./notification.model");

const ReportModel = sequelize.define(
  "reportes",
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    titulo: DataTypes.STRING(),
    descripcion: DataTypes.STRING(),
    ubicacion: DataTypes.STRING(),
    estado: {
      type: DataTypes.ENUM("no_evaluado", "evaluado", "en_gestion"),
    },
    createdAt: {
      type: DataTypes.TIME(),
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.TIME(),
      field: "updated_at",
    },
  },
  { timestamps: false }
);

ReportModel.hasMany(NotificationModel, { foreignKey: "reporte_id" });
NotificationModel.belongsTo(ReportModel, { foreignKey: "reporte_id" });

module.exports = ReportModel;
