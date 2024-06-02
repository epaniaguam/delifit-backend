import { Router } from "express";
import { FacturaController } from "../controllers/factura.js";

export const createFacturaRouter = ({ facturaModel }) => {
  const facturaRouter = Router();

  const facturaController = new FacturaController({
    facturaModel,
  });

  facturaRouter.get("/", facturaController.getAll);
  facturaRouter.get("/:id", facturaController.getById);
  facturaRouter.post("/", facturaController.create);
  facturaRouter.patch("/:id", facturaController.update);
  facturaRouter.delete("/:id", facturaController.delete);

  return facturaRouter;
};
