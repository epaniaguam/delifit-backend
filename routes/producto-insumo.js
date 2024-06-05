import { Router } from "express";
import { ProductoInsumoController } from "../controllers/producto-insumo.js";

export const createProductoInsumoRouter = ({ productoInsumoModel }) => {
  const productoInsumoRouter = Router(); // Creamos usuarioRouter que se usara en app.js

  const productoInsumoController = new ProductoInsumoController({
    productoInsumoModel,
  });

  productoInsumoRouter.get("/", productoInsumoController.getAll);
  productoInsumoRouter.get("/:id", productoInsumoController.getById);
  productoInsumoRouter.post("/", productoInsumoController.create);
  productoInsumoRouter.patch("/:id", productoInsumoController.update);
  productoInsumoRouter.delete(
    "/:id_producto/:id_insumo?",
    productoInsumoController.delete,
  );

  return productoInsumoRouter; // retornamos el router que se exportara con createProductoInsumoRouter
};
