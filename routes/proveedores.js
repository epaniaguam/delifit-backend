import { Router } from 'express'
import { ProveedorController } from '../controllers/proveedores.js'

export const createProveedorRouter = ({ proveedoresModel }) => {
  const proveedoresRouter = Router()

  const proveedorController = new ProveedorController({ proveedoresModel })

  proveedoresRouter.get('/', proveedorController.getAll)

  return proveedoresRouter
}
