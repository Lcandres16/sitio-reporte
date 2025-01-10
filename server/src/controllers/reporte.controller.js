// reporte.controller.js
const db = require('../config/database');

const reporteController = {
  crearReporte: async (req, res) => {
    try {
      const { titulo, descripcion, categoria_id, ubicacion, usuario_id } = req.body;
      
      // Primero, crear el reporte
      const queryReporte = `
        INSERT INTO reportes 
        (titulo, descripcion, categoria_id, ubicacion, usuario_id, estado) 
        VALUES (?, ?, ?, ?, ?, 'no_evaluado')
      `;

      const [resultReporte] = await db.query(queryReporte, [
        titulo,
        descripcion,
        categoria_id,
        ubicacion,
        usuario_id
      ]);

      const reporteId = resultReporte.insertId;

      // Si hay imagen, guardarla en la tabla imagenes
      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        const queryImagen = `
          INSERT INTO imagenes 
          (reporte_id, url, tipo) 
          VALUES (?, ?, ?)
        `;

        await db.query(queryImagen, [
          reporteId,
          imageUrl,
          req.file.mimetype
        ]);
      }

      res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente',
        data: {
          id: reporteId
        }
      });
    } catch (error) {
      console.error('Error al crear reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el reporte'
      });
    }
  },

  obtenerReportes: async (req, res) => {
    try {
      const query = `
        SELECT r.*, i.url as imagen_url, c.nombre as categoria_nombre,
               u.nombre as usuario_nombre
        FROM reportes r 
        LEFT JOIN imagenes i ON r.id = i.reporte_id
        LEFT JOIN categorias c ON r.categoria_id = c.id
        LEFT JOIN usuarios u ON r.usuario_id = u.id
        ORDER BY r.created_at DESC
      `;
      
      const [reportes] = await db.query(query);
      res.json(reportes);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los reportes'
      });
    }
  },

  obtenerCategorias: async (req, res) => {
    try {
      const [categorias] = await db.query('SELECT * FROM categorias WHERE activo = true');
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías'
      });
    }
  }
};

module.exports = reporteController;