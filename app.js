import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { createProveedorRouter } from './routes/proveedores.js'

export const createApp = ({ proveedoresModel }) => {
  const app = express()
  app.use(json()) // Leemos nuestro body como JSON

  app.use(corsMiddleware())
  app.disable('x-powered-by') // Deshabilita el header X-Powered-By que muestra la tecnología que usamos

  /// GETS ////

  app.get('/', (req, res) => {
    res.json({ mensaje: 'Hola Delifit' })
  })

  // Usamos la carpeta ROUTES para separar las rutas //////
  app.use('/proveedores', createProveedorRouter({ proveedoresModel }))

  /// CONEXION ////

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
  })
}
