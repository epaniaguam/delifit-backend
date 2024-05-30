import { Router } from "express";
import { PromocionController } from "../controllers/promocion.js";

export const createPromocionRouter = ({ promocionModel }) => {
  const promocionRouter = Router(); // Creamos usuarioRouter que se usara en app.js

  const promocionController = new PromocionController({ promocionModel });

  promocionRouter.get("/", promocionController.getAll);
  promocionRouter.get("/:id", promocionController.getById);
  promocionRouter.post("/", promocionController.create);
  promocionRouter.patch("/:id", promocionController.update);
  promocionRouter.delete("/:id", promocionController.delete);

  return promocionRouter; // retornamos el router que se exportara con createUsuarioRouter
};
