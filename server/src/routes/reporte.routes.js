const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Controlador de reportes
const reporteController = require('../controllers/reporte.controller');

// Rutas - nota que quitamos '/reportes' porque el prefijo se añade en app.js
router.post('/', upload.single('imagen'), reporteController.crearReporte);
router.get('/categorias', reporteController.obtenerCategorias);

module.exports = router;