import { randomUUID } from 'node:crypto'

// import proveedoreesJSON from './JSONdelifit/Proveedores.json' with {type:'json'}

// Forma actual de leer un JSON recomendada hasta que se habilite WITH
import { readJSON } from '../../utils.js'

const proveedoreesJSON = readJSON('./JSONdelifit/Proveedores.json') // hemos creado un require en utils.json para facilitar la lectura

export class ProveedorModel {
  static async getAll ({ idProveedor, nomProveedor, contacto }) {
    if (idProveedor) {
      return proveedoreesJSON.filter((prov) => prov.idProveedor === parseInt(idProveedor))
    }
    if (contacto) {
      return proveedoreesJSON.filter((prov) => prov.contacto === parseInt(contacto)
      )
    }
    return proveedoreesJSON // Si no hay query params, devolvemos todas las peliculas
  }
}
