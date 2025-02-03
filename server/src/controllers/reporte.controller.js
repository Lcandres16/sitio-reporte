// reporte.controller.js
const db = require("../config/database");
const NotificationModel = require("../models/notification.model");
const ReportModel = require("../models/report.model");
const asyncErrorHandler = require("../utils/async-error-handler");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const reporteController = {
  crearReporte: async (req, res) => {
    try {
      const { titulo, descripcion, categoria_id, ubicacion, usuario_id } =
        req.body;

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
        usuario_id,
      ]);

      const reporteId = resultReporte.insertId;

      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        const queryImagen = `
          INSERT INTO imagenes 
          (reporte_id, url, tipo) 
          VALUES (?, ?, ?)
        `;

        await db.query(queryImagen, [reporteId, imageUrl, req.file.mimetype]);
      }

      res.status(201).json({
        success: true,
        message: "Reporte creado exitosamente",
        data: {
          id: reporteId,
        },
      });
    } catch (error) {
      console.error("Error al crear reporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el reporte",
      });
    }
  },

  obtenerReportes: async (req, res) => {
    try {
      const { categoryName = null } = req.query;

      const query = `
        SELECT r.*, i.url as imagen_url, c.nombre as categoria_nombre,
               u.nombre as usuario_nombre
        FROM reportes r 
        LEFT JOIN imagenes i ON r.id = i.reporte_id
        LEFT JOIN categorias c ON r.categoria_id = c.id
        LEFT JOIN usuarios u ON r.usuario_id = u.id
        WHERE (c.nombre = ? OR ? IS NULL)
        ORDER BY r.created_at DESC
      `;

      const [reportes] = await db.query(query, [categoryName, categoryName]);
      res.json(reportes);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener los reportes",
      });
    }
  },

  obtenerUnReporte: async (req, res) => {
    try {
      const { reportId } = req.params;
      const query = `
        SELECT r.*, i.url as imagen_url, c.nombre as categoria_nombre,
               u.nombre as usuario_nombre
        FROM reportes r 
        LEFT JOIN imagenes i ON r.id = i.reporte_id
        LEFT JOIN categorias c ON r.categoria_id = c.id
        LEFT JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.id = ?
      `;

      const [[reporte]] = await db.query(query, [reportId]);
      if (!reporte) {
        throw new Error("reporte no encontrado");
      }
      res.json(reporte);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener el reporte",
      });
    }
  },

  descargarReporte: async (req, res) => {
    try {
      const { reportId } = req.params;

      const query = `
        SELECT r.*, i.url as imagen_url, c.nombre as categoria_nombre,
               u.nombre as usuario_nombre, r.created_at
        FROM reportes r 
        LEFT JOIN imagenes i ON r.id = i.reporte_id
        LEFT JOIN categorias c ON r.categoria_id = c.id
        LEFT JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.id = ?
      `;

      const [[reporte]] = await db.query(query, [reportId]);

      if (!reporte) {
        return res.status(404).json({
          success: false,
          message: "Reporte no encontrado",
        });
      }

      // Crear el PDF con opciones específicas
      const doc = new PDFDocument({
        autoFirstPage: true,
        bufferPages: true,
      });

      // Buffer para almacenar el PDF
      const chunks = [];

      // Capturar el contenido del PDF
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-disposition",
          `attachment; filename=Reporte-${reportId}.pdf`
        );
        res.setHeader("Content-Length", Buffer.byteLength(result));
        res.end(result);
      });

      // Manejar errores del documento
      doc.on("error", (err) => {
        console.error("Error en la generación del PDF:", err);
        res.status(500).json({
          success: false,
          message: "Error al generar el PDF",
        });
      });

      // Contenido del PDF
      doc.fontSize(20).text("Reporte Detallado", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Título: ${reporte.titulo}`);
      doc.fontSize(12).text(`Categoría: ${reporte.categoria_nombre}`);
      doc.text(`Estado: ${reporte.estado}`);
      doc.text(`Reportado por: ${reporte.usuario_nombre}`);
      doc.text(`Fecha: ${new Date(reporte.created_at).toLocaleString()}`);
      doc.moveDown();
      doc.fontSize(12).text("Descripción:", { underline: true });
      doc.text(reporte.descripcion);

      // Agregar imagen si existe
      if (reporte.imagen_url) {
        try {
          const imagePath = path.resolve(
            __dirname,
            "../../public",
            reporte.imagen_url.replace(/^\//, "")
          );
          console.log("Ruta de imagen:", imagePath);
          console.log("Existe imagen:", fs.existsSync(imagePath));

          if (fs.existsSync(imagePath)) {
            doc.moveDown();
            doc.image(imagePath, {
              fit: [500, 300],
              align: "center",
            });
          }
        } catch (imgError) {
          console.error("Error al procesar imagen:", imgError);
        }
      }

      // Finalizar el documento
      doc.end();
    } catch (error) {
      console.error("Error al descargar reporte:", error);
      res.status(500).json({
        success: false,
        message: "Error al descargar el reporte",
      });
    }
  },

  setEvaludatedStatus: asyncErrorHandler(async (req, res) => {
    const { reportId, userId } = req.body;

    const report = await ReportModel.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error("report not found");
    }

    if (report.get().estado === "resuelto") {
      return res.status(200).json(report);
    }

    await NotificationModel.create({
      userId: userId,
      reportId: reportId,
      tipo: "reporte",
    });

    const [reportes] = await db.query(
      `UPDATE reportes SET estado = "resuelto" WHERE id = ?`,
      [reportId]
    );

    res.status(200).json(reportes);
  }),

  obtenerCategorias: async (req, res) => {
    try {
      const [categorias] = await db.query(
        "SELECT * FROM categorias WHERE activo = true"
      );
      res.json(categorias);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las categorías",
      });
    }
  },
};

module.exports = reporteController;
