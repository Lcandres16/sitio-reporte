// src/routes/categoria.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/categorias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

module.exports = router;