// reporte.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Controlador de reportes
const reporteController = require("../controllers/reporte.controller");
const { body } = require("express-validator");

// Rutas
router.post("/", upload.single("imagen"), reporteController.crearReporte);
router.get("/", reporteController.obtenerReportes); // Nueva ruta añadida
router.get("/:reportId", reporteController.obtenerUnReporte);
router.patch(
  "/",
  [body("userId").isNumeric(), body("reportId").isNumeric()],
  reporteController.setEvaludatedStatus
);
router.get("/categorias", reporteController.obtenerCategorias);

module.exports = router;
