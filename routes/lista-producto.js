import { Router } from "express";
import { ListaProductoController } from "../controllers/lista-producto.js";

export const createListaProductoRouter = ({ listaProductoModel }) => {
  const listaProductoRouter = Router();

  const listaProductoController = new ListaProductoController({
    listaProductoModel,
  });

  listaProductoRouter.get("/", listaProductoController.getAll);
  listaProductoRouter.get(
    "/:id_pedido/:id_producto?",
    listaProductoController.getById,
  );
  listaProductoRouter.post("/", listaProductoController.create);
  listaProductoRouter.patch("/:id", listaProductoController.update);
  listaProductoRouter.delete(
    "/:id_pedido/:id_producto",
    listaProductoController.delete,
  );

  return listaProductoRouter;
};
