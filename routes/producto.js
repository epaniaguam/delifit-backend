import { Router } from 'express'
import { ProductoController } from '../controllers/producto.js'

export const createProductoRouter = ({ productoModel }) => {
  const productoRouter = Router() // Creamos usuarioRouter que se usara en app.js

  const productoController = new ProductoController({ productoModel })

  productoRouter.get('/', productoController.getAll)
  productoRouter.get('/:id', productoController.getById)
  productoRouter.post('/', productoController.create)
  productoRouter.patch('/:id', productoController.update)
  productoRouter.delete('/:id', productoController.delete)

  return productoRouter // retornamos el router que se exportara con createUsuarioRouter
}
