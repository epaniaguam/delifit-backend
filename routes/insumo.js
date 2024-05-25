import { Router } from "express";
import { InsumoController } from "../controllers/insumo.js";

export const createInsumoRouter = ({ insumoModel }) => {
  const insumoRouter = Router(); // Creamos usuarioRouter que se usara en app.js

  const insumoController = new InsumoController({ insumoModel });

  insumoRouter.get("/", insumoController.getAll);
  insumoRouter.get("/:id", insumoController.getById);
  insumoRouter.post("/", insumoController.create);
  insumoRouter.patch("/:id", insumoController.update);
  insumoRouter.delete("/:id", insumoController.delete);

  return insumoRouter; // retornamos el router que se exportara con createUsuarioRouter
};
