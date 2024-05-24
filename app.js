import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createUsuarioRouter } from "./routes/usuario.js";

export const createApp = ({ usuarioModel }) => {
  const app = express();
  app.use(json()); // Leemos nuestro body como JSON

  app.use(corsMiddleware());
  app.disable("x-powered-by"); // Deshabilita el header X-Powered-By que muestra la tecnología que usamos

  /// GETS ////

  app.get("/", (req, res) => {
    res.json({ mensaje: "Hola Delifit" });
  });

  // Usamos la carpeta ROUTES para separar las rutas //////
  app.use("/usuario", createUsuarioRouter({ usuarioModel }));

  /// CONEXION ////

  const PORT = process.env.PORTAPI ?? 1234;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
  });
};
