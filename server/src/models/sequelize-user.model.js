const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const UserModel = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(),
    },
    email: {
      type: DataTypes.STRING(),
    },
    telefono: {
      type: DataTypes.STRING(),
    },
    activo: {
      type: DataTypes.BOOLEAN(),
    },
    created_at: {
      type: DataTypes.TIME(),
    },
  },
  { timestamps: false }
);

module.exports = UserModel;
