const bcrypt = require('bcryptjs');
require('dotenv').config();
// Ajustamos la ruta para que apunte a src/config/database.js
const pool = require('../src/config/database');

async function createAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('soyadministrador', salt);
    
    const [result] = await pool.query(
      'INSERT INTO administradores (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      ['Andres Lucero', 'andreslucerodj@gmail.com', hashedPassword, 'admin']
    );
    
    console.log('Administrador creado exitosamente');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('Error completo:', error);
  } finally {
    // Cerrar la conexión
    if (pool) {
      await pool.end();
    }
    process.exit();
  }
}

createAdmin();