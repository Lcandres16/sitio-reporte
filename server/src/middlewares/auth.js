// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token no proporcionado' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador' 
    });
  }
  next();
};