import { Router } from 'express'
import { ListaPromocionController } from '../controllers/lista-promocion.js'

export const createListaPromocionRouter = ({ listaPromocionModel }) => {
  const listaPromocionRouter = Router()

  const listaPromocionController = new ListaPromocionController({
    listaPromocionModel
  })

  listaPromocionRouter.get('/', listaPromocionController.getAll)
  listaPromocionRouter.get(
    '/:id_pedido/:id_promocion?',
    listaPromocionController.getById
  )
  listaPromocionRouter.post('/', listaPromocionController.create)
  listaPromocionRouter.patch('/:id', listaPromocionController.update)
  listaPromocionRouter.delete(
    '/:id_pedido/:id_promocion',
    listaPromocionController.delete
  )

  return listaPromocionRouter
}
