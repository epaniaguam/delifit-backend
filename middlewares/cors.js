import cors from 'cors'

const ACCESS_ORIGINS = [
  'http://localhost:4000',
  'http://localhost:3000',
  'http://localhost:3001'
]

/*
({ acceptOrigins = ACCESS_ORIGINS } = {})  ==> podemos aceptar argumentos desde fuera y por defecto tomara ACCESS_ORIGINS, si no se le pasa nada
*/

export const corsMiddleware = ({ acceptOrigins = ACCESS_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Origen no permitido por CORS (libreria) '))
    }
  })
