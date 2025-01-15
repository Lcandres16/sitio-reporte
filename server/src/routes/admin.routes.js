// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Ruta pública de login
router.post('/login', authController.adminLogin);

// Rutas protegidas que requieren autenticación
router.get('/reports', verifyToken, isAdmin, authController.getAdminReports);
router.put('/reports/:reporteId/status', verifyToken, isAdmin, authController.updateReportStatus);

module.exports = router;