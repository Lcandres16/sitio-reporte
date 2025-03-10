const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Importar la configuración de la base de datos
const db = require("./models");

// Importación de rutas
const usuarioRoutes = require("./routes/usuario.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const reporteRoutes = require("./routes/reporte.routes");
const adminRoutes = require("./routes/admin.routes");
const avisoRouter = require("./routes/aviso.routes");
const notificationRouter = require("./routes/notification.routes");
const ENV = require("./config/environment");
const redirectHttpToHttps = require("./middlewares/redirectToHttps");
const https = require("https");

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear la carpeta uploads y  dir si no existen
const uploadsDir = path.join(__dirname, "../public/uploads");

if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos
app.use("/", express.static(path.join(__dirname, "../dist")));
console.log(path.join(__dirname, "../dist"));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Rutas
app.use("/api/auth", usuarioRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", categoriaRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/avisos", avisoRouter);
app.use("/api/notificaciones", notificationRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err,
    success: false,
    message: "Error interno del servidor",
  });
});

app.get("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../", "/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

// Sincronizar la base de datos y luego iniciar el servidor
db.sequelize
  .sync()
  .then(() => {
    console.log(ENV);
    const options = {
      cert: require("fs").readFileSync(ENV.CERT_SSL_PATH || "", "utf-8"),
      key: require("fs").readFileSync(ENV.KEY_SSL_PATH || "", "utf-8"),
    };

    const server = https.createServer(options, app);

    server.listen(ENV.HTTPS_PORT, () => {
      console.log(`https server has started in port ${ENV.HTTPS_PORT}`);
    });

    if (ENV.HTTPS_REDIRECT) {
      const httpServer = express();
      httpServer.get("*", redirectHttpToHttps);
      httpServer.listen(ENV.PORT, () => {
        console.log(`http server has started in port ${ENV.PORT}`);
      });
      return;
    }

    app.listen(PORT, () => {
      console.log("Base de datos sincronizada");
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });

module.exports = app;
