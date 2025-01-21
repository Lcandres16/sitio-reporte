const AvisoModel = require("../models/aviso.model");
const asyncErrorHandler = require("../utils/async-error-handler");

const avisoController = {
  getAll: asyncErrorHandler(async (req, res) => {
    const avisos = await AvisoModel.findAll();

    res.status(200).json(avisos);
  }),
  save: asyncErrorHandler(async (req, res) => {
    const { titulo, contenido, importante, adminId } = req.body;

    const aviso = await AvisoModel.create({
      titulo,
      contenido,
      importante: importante === "true",
      admin_id: adminId,
    });

    res.status(200).json(aviso);
  }),
};

module.exports = avisoController;
