// reporte.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const reporteController = require("../controllers/reporte.controller");
const { body, query } = require("express-validator");
const CATEGORIES = require("../const/categories");

router.post("/", upload.single("imagen"), reporteController.crearReporte);
router.get(
  "/",
  [query("categoryName").isIn(Object.values(CATEGORIES)).optional()],
  reporteController.obtenerReportes
);
router.get("/categorias", reporteController.obtenerCategorias);
router.get("/download/:reportId", reporteController.descargarReporte);
router.get("/:reportId", reporteController.obtenerUnReporte);
router.patch(
  "/",
  [body("userId").isNumeric(), body("reportId").isNumeric()],
  reporteController.setEvaludatedStatus
);

module.exports = router;