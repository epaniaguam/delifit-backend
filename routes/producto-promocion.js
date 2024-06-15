import { Router } from 'express'
import { ProductoPromocionController } from '../controllers/producto-promocion.js'

export const createProductoPromocionRouter = ({ productoPromocionModel }) => {
  const productoPromocionRouter = Router() // Creamos usuarioRouter que se usara en app.js

  const productoPromocionController = new ProductoPromocionController({
    productoPromocionModel
  })

  productoPromocionRouter.get('/', productoPromocionController.getAll)
  productoPromocionRouter.get('/:id', productoPromocionController.getById)
  productoPromocionRouter.post('/', productoPromocionController.create)
  productoPromocionRouter.patch('/:id', productoPromocionController.update)
  productoPromocionRouter.delete(
    '/:id_producto/:id_promocion',
    productoPromocionController.delete
  )

  return productoPromocionRouter // retornamos el router que se exportara con createProductoPromocionRouter
}
