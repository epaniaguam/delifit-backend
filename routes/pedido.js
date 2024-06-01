import { Router } from "express";
import { PedidoController } from "../controllers/pedido.js";

export const createPedidoRouter = ({ pedidoModel }) => {
  const pedidoRouter = Router();

  const pedidoController = new PedidoController({
    pedidoModel,
  });

  pedidoRouter.get("/", pedidoController.getAll);
  pedidoRouter.get("/:id_pedido/:id_usuario?", pedidoController.getById);
  pedidoRouter.post("/", pedidoController.create);
  pedidoRouter.patch("/:id", pedidoController.update);
  pedidoRouter.delete("/:id_pedido/:id_usuario?", pedidoController.delete);

  return pedidoRouter;
};
