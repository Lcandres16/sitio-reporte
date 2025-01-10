const db = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async crear(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const query = `
        INSERT INTO usuarios (nombre, email, password, telefono)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute(query, [
        userData.nombre,
        userData.email,
        hashedPassword,
        userData.telefono
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async buscarPorEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  }
}

module.exports = Usuario;