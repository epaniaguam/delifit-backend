import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createInsumoRouter } from "./routes/insumo.js";
import { createPersonalRouter } from "./routes/personal.js";
import { createProductoInsumoRouter } from "./routes/producto-insumo.js";
import { createProductoPromocionRouter } from "./routes/producto-promocion.js";
import { createProductoRouter } from "./routes/producto.js";
import { createPromocionRouter } from "./routes/promocion.js";
import { createUsuarioRouter } from "./routes/usuario.js";

export const createApp = ({
  usuarioModel,
  personalModel,
  insumoModel,
  productoModel,
  productoInsumoModel,
  productoPromocionModel,
  promocionModel,
}) => {
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
  app.use("/personal", createPersonalRouter({ personalModel }));
  app.use("/insumo", createInsumoRouter({ insumoModel }));
  app.use("/producto", createProductoRouter({ productoModel }));
  app.use("/promocion", createPromocionRouter({ promocionModel }));
  app.use(
    "/producto-insumo",
    createProductoInsumoRouter({ productoInsumoModel }),
  );
  app.use(
    "/producto-promocion",
    createProductoPromocionRouter({ productoPromocionModel }),
  );

  /// CONEXION ////

  const PORT = process.env.PORTAPI ?? 1234;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
  });
};
