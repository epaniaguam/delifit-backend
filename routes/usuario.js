import { Router } from 'express'
import { UsuarioController } from '../controllers/usuario.js'

export const createUsuarioRouter = ({ usuarioModel }) => {
  const usuarioRouter = Router() // Creamos usuarioRouter que se usara en app.js

  const usuarioController = new UsuarioController({ usuarioModel })

  usuarioRouter.get('/', usuarioController.getAll)
  usuarioRouter.get('/:id', usuarioController.getById)
  usuarioRouter.post('/', usuarioController.create)
  usuarioRouter.patch('/:id', usuarioController.update)
  usuarioRouter.delete('/:id', usuarioController.delete)

  return usuarioRouter // retornamos el router que se exportara con createUsuarioRouter
}
