import { pool } from '../../db/conexion.js'

export class CategoriaModel {
  static async getAll({
    id_categoria,
    descripcion_categoria,
    tipo,
    visibilidad
  }) {
    let client
    try {
      client = await pool.connect()

      if (visibilidad) {
        const result = await client.query(
          'SELECT * FROM categoria WHERE visibilidad = $1 ORDER BY id_categoria ASC;',
          [visibilidad]
        )
        return result.rows
      }
      if (id_categoria) {
        const result = await client.query(
          'SELECT * FROM categoria WHERE id_categoria = $1 AND visibilidad=true ORDER BY id_categoria ASC;',
          [id_categoria]
        )
        return result.rows
      }
      if (descripcion_categoria) {
        const result = await client.query(
          'SELECT * FROM categoria WHERE descripcion_categoria = $1 AND visibilidad=true;',
          [descripcion_categoria]
        )
        return result.rows
      }
      if (tipo) {
        const result = await client.query(
          'SELECT * FROM categoria WHERE tipo = $1 AND visibilidad=true;',
          [tipo]
        )
        return result.rows
      }

      const result = await client.query(
        'SELECT * FROM categoria WHERE visibilidad=true ORDER BY id_categoria ASC;'
      )
      return result.rows
    } catch (error) {
      console.error('Error executing query', error.message)
      return error
    } finally {
      client.release()
    }
  }

  static async getById({ id }) {
    let client
    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM categoria WHERE id_categoria = $1 AND visibilidad=true;',
        [id]
      )
      return result.rows[0]
    } catch (error) {
      console.error('Error executing query', error.message)
      return error
    } finally {
      client.release()
    }
  }

  static async create({ input }) {
    let client

    const { descripcion_categoria, tipo } = input
    try {
      client = await pool.connect()

      // Verificar si ya existe una categoria con el mismo nombre y precio para actualizarlo en vez de crearlo
      const dataSame = await client.query(
        'SELECT id_categoria FROM categoria WHERE descripcion_categoria = $1 AND tipo = $2 AND visibilidad = false;',
        [descripcion_categoria, tipo]
      )
      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true }
        const id = dataSame.rows[0].id_categoria

        return CategoriaModel.update({ id, input })
      }

      const result = await client.query(
        'SELECT public.registrar_categoria($1, $2)',
        [descripcion_categoria, tipo]
      )

      return result.rows[0]
    } catch (error) {
      console.error('Error executing query', error.message)
      throw error.message
    } finally {
      client.release()
    }
  }

  static async update({ id, input }) {
    let client
    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM categoria WHERE id_categoria = $1',
        [id]
      )

      if (result.rows.length === 0) {
        return false
      }
      const dataUpdate = { ...result.rows[0], ...input }
      await client.query(
        'UPDATE categoria SET descripcion_categoria=$1, tipo=$2, visibilidad=$3 WHERE id_categoria = $4',
        [
          dataUpdate.descripcion_categoria,
          dataUpdate.tipo,
          dataUpdate.visibilidad,
          id
        ]
      )
      const dataActualizada = await client.query(
        'SELECT * FROM categoria WHERE id_categoria = $1',
        [id]
      )

      return dataActualizada.rows[0]
    } catch (error) {
      console.error('Error executing query', error.message)
      throw error
    } finally {
      client.release()
    }
  }

  static async delete({ id }) {
    let client
    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM categoria WHERE id_categoria = $1',
        [id]
      )

      if (result.rows.length > 0) {
        await client.query(
          'UPDATE categoria SET visibilidad=$1 WHERE id_categoria = $2',
          [false, id]
        )
        return true
      }
      return false
    } catch (error) {
      console.error('Error executing query', error.message)
      throw error
    } finally {
      client.release()
    }
  }
}
