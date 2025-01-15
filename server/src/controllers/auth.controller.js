// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Login para usuarios normales
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        isAdmin: false
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Login para administradores
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await pool.query(
      'SELECT * FROM administradores WHERE email = ?',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const admin = admins[0];
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        rol: admin.rol,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Error en login de administrador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Registro de usuarios
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );

    const token = jwt.sign(
      { 
        id: result.insertId,
        email,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        nombre,
        email,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Obtener reportes (para administradores)
exports.getAdminReports = async (req, res) => {
  try {
    const [reportes] = await pool.query(`
      SELECT 
        r.*,
        u.nombre as nombre_usuario,
        u.email as email_usuario,
        c.nombre as categoria,
        GROUP_CONCAT(i.url) as imagenes
      FROM reportes r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      LEFT JOIN categorias c ON r.categoria_id = c.id
      LEFT JOIN imagenes i ON r.id = i.reporte_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      reportes
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los reportes' 
    });
  }
};

// Actualizar estado de reporte
exports.updateReportStatus = async (req, res) => {
  const { reporteId } = req.params;
  const { estado } = req.body;

  try {
    await pool.query(
      'UPDATE reportes SET estado = ? WHERE id = ?',
      [estado, reporteId]
    );

    // Crear notificación para el usuario
    const [reporte] = await pool.query(
      'SELECT usuario_id FROM reportes WHERE id = ?',
      [reporteId]
    );

    if (reporte.length > 0) {
      await pool.query(
        'INSERT INTO notificaciones (usuario_id, reporte_id, tipo) VALUES (?, ?, ?)',
        [reporte[0].usuario_id, reporteId, `reporte_${estado}`]
      );
    }

    res.json({
      success: true,
      message: 'Estado del reporte actualizado'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del reporte'
    });
  }
};