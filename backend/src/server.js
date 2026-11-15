const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Servir el FRONTEND desde client/public
//    __dirname = backend/src  →  ../../ = raíz  →  client/public
const PUBLIC_DIR = path.join(__dirname, "..", "..", "client", "public");
app.use(express.static(PUBLIC_DIR));

// 🧾 Ruta del formulario de contacto
app.post("/api/contacto", async (req, res) => {
  try {
    const { nombre, email, telefono, propiedad, servicio, mensaje } = req.body;

    if (!nombre || !email || !telefono) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios (Nombre, Email, Teléfono).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del correo electrónico no es válido.",
      });
    }

    const { error } = await resend.emails.send({
      from: `SEGURPRO SpA <${process.env.FROM_EMAIL}>`,
      to: [process.env.TO_EMAIL],
      subject: `🔔 Nuevo Lead: ${servicio || "General"} - ${nombre}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #E30613; border-bottom: 2px solid #E30613; padding-bottom: 10px;">
                        Nuevo Contacto desde la Landing Page
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Nombre:</td><td>${nombre}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td><a href="tel:${telefono}">${telefono}</a></td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Propiedad:</td><td>${propiedad || "No especificado"}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Servicio:</td><td>${servicio || "No especificado"}</td></tr>
                    </table>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #E30613;">
                        <strong>Mensaje del cliente:</strong><br>
                        <p style="margin-top: 5px;">${mensaje || "Sin mensaje adicional"}</p>
                    </div>
                    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Enviado desde el formulario de diagnóstico gratuito de <strong>segurpro.cl</strong>
                    </p>
                </div>
            `,
    });

    if (error) {
      console.error("❌ Error de Resend:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al procesar el formulario.",
      });
    }

    console.log(`✅ Lead de ${nombre} enviado a ${process.env.TO_EMAIL}`);
    res.status(200).json({
      success: true,
      message: "Solicitud enviada. Nos contactaremos en menos de 24 horas.",
    });
  } catch (err) {
    console.error("💥 Error crítico:", err);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
});

// 🏠 Cualquier ruta no-API sirve el index.html del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📂 Sirviendo frontend desde: ${PUBLIC_DIR}`);
  console.log(`📧 Enviando correos desde: ${process.env.FROM_EMAIL}`);
});
