import { pool } from '../../db/conexion.js'

export class FacturaModel {
  static async getAll({ fecha }) {
    let client
    try {
      client = await pool.connect()

      if (fecha) {
        const result = await client.query(
          'SELECT * FROM factura WHERE fecha_recepcion = $1;',
          [fecha]
        )
        return result.rows
      }

      const result = await client.query('SELECT * FROM factura;')
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
        'SELECT * FROM factura WHERE id_factura = $1;',
        [id]
      )
      return result.rows
    } catch (error) {
      console.error('Error executing query', error.message)
      return error
    } finally {
      client.release()
    }
  }

  static async create({ input }) {
    let client

    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT registrar_factura($1, $2, $3);',
        [input.id_pedido, input.id_personal, input.fecha_recepcion]
      )
      return result.rows
    } catch (error) {
      console.error('Error executing query: ', error.message)
      throw error
    } finally {
      client.release()
    }
  }

  static async update({ id, input }) {
    let client
    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM factura WHERE id_factura = $1;',
        [id]
      )
      if (result.rows.length === 0) {
        return false
      }

      const dataUpdate = { ...result.rows[0], ...input }
      await client.query(
        'UPDATE factura SET id_pedido=$1, id_personal=$2, fecha_recepcion=$3 WHERE id_factura = $4 RETURNING *;',
        [
          dataUpdate.id_pedido,
          dataUpdate.id_personal,
          dataUpdate.fecha_recepcion,
          id
        ]
      )
      const dataActualizada = await client.query(
        'SELECT * FROM factura WHERE id_factura = $1',
        [id]
      )
      return dataActualizada.rows
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
        'SELECT * FROM factura WHERE id_factura = $1',
        [id]
      )
      if (result.rows.length > 0) {
        await client.query(
          'DELETE FROM factura WHERE id_factura = $1 RETURNING *;',
          [id]
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
