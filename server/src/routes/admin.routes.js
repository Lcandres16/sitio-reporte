const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const db = require('../models');
const { Op } = require('sequelize');

// Rutas existentes
router.post('/login', authController.adminLogin);
router.get('/reports', verifyToken, isAdmin, authController.getAdminReports);
router.put('/reports/:reporteId/status', verifyToken, isAdmin, authController.updateReportStatus);

// Nuevas rutas para avisos
router.post('/notices', verifyToken, isAdmin, async (req, res) => {
  try {
    const { titulo, contenido, importante } = req.body;
    
    const notice = await db.Notice.create({
      admin_id: req.user.id, // Asumiendo que tienes el ID del admin en req.user
      titulo,
      contenido,
      importante: importante || false,
      created_at: new Date()
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error('Error al crear aviso:', error);
    res.status(500).json({ message: 'Error al crear el aviso' });
  }
});

router.get('/notices/active', async (req, res) => {
  try {
    const activeNotices = await db.Notice.findAll({
      order: [['created_at', 'DESC']],
      limit: 10 // Limitamos a los 10 avisos más recientes
    });
    
    res.json(activeNotices);
  } catch (error) {
    console.error('Error al obtener avisos:', error);
    res.status(500).json({ message: 'Error al obtener los avisos' });
  }
});

module.exports = router;