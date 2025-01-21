const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const AvisoModel = sequelize.define(
  "avisos",
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER(),
    },
    titulo: {
      type: DataTypes.STRING(),
    },
    contenido: {
      type: DataTypes.STRING(),
    },
    importante: {
      type: DataTypes.BOOLEAN(),
    },
    created_at: {
      type: DataTypes.TIME(),
    },
  },
  { timestamps: false }
);

module.exports = AvisoModel;
