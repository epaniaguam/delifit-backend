import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.js";

export const createCategoriaRouter = ({ categoriaModel }) => {
  const categoriaRouter = Router();

  const categoriaController = new CategoriaController({ categoriaModel });

  categoriaRouter.get("/", categoriaController.getAll);
  categoriaRouter.get("/:id", categoriaController.getById);
  categoriaRouter.post("/", categoriaController.create);
  categoriaRouter.patch("/:id", categoriaController.update);
  categoriaRouter.delete("/:id", categoriaController.delete);

  return categoriaRouter;
};
