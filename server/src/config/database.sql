-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS citizen_reporter;
USE citizen_reporter;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Administradores
CREATE TABLE administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Tabla de Reportes
CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    categoria_id INT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    estado ENUM('no_evaluado', 'en_gestion', 'resuelto') DEFAULT 'no_evaluado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de Imágenes
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporte_id INT,
    url VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporte_id) REFERENCES reportes(id)
);

-- Tabla de Avisos
CREATE TABLE avisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    importante BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    reporte_id INT,
    tipo VARCHAR(50) NOT NULL,
    leida BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (reporte_id) REFERENCES reportes(id)
);

-- Insertar categorías básicas
INSERT INTO categorias (nombre, descripcion) VALUES
('Agua Potable', 'Problemas relacionados con el servicio de agua potable'),
('Electricidad', 'Problemas con el servicio eléctrico'),
('Alcantarillado', 'Problemas con el sistema de alcantarillado'),
('Alumbrado Público', 'Problemas con el alumbrado en calles y espacios públicos'),
('Recolección de Basura', 'Problemas con el servicio de recolección de residuos');