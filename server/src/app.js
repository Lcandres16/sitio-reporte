const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importación de rutas
const usuarioRoutes = require('./routes/usuario.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const reporteRoutes = require('./routes/reporte.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear la carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rutas
app.use('/api/auth', usuarioRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', categoriaRoutes);
app.use('/api/reportes', reporteRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;