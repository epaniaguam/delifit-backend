import { Router } from "express";
import { PersonalController } from "../controllers/personal.js";

export const createPersonalRouter = ({ personalModel }) => {
  const personalRouter = Router(); // Creamos usuarioRouter que se usara en app.js

  const personalController = new PersonalController({ personalModel });

  personalRouter.get("/", personalController.getAll);
  personalRouter.get("/:id", personalController.getById);
  personalRouter.post("/", personalController.create);
  personalRouter.patch("/:id", personalController.update);
  personalRouter.delete("/:id", personalController.delete);

  return personalRouter; // retornamos el router que se exportara con createUsuarioRouter
};
