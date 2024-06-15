import { pool } from '../../db/conexion.js'

export class ProductoPromocionModel {
  static async getAll({ id_producto, id_promocion }) {
    let client
    try {
      client = await pool.connect()

      if (id_producto) {
        const result = await client.query(
          'SELECT * FROM prod_promocion WHERE id_producto = $1;',
          [id_producto]
        )
        return result.rows
      }
      if (id_promocion) {
        const result = await client.query(
          'SELECT * FROM prod_promocion WHERE id_promocion = $1;',
          [id_promocion]
        )
        return result.rows
      }

      const result = await client.query('SELECT * FROM prod_promocion;')
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
        'SELECT * FROM prod_promocion WHERE id_producto = $1;',
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
        'SELECT registrar_prod_promocion($1, $2, $3);',
        [input.id_producto, input.id_promocion, input.cantidad]
      )
      // console.log("result:", result.rows);
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
        'SELECT * FROM prod_promocion WHERE id_producto = $1;',
        [id]
      )
      console.log('result:', result.rows)
      if (result.rows.length === 0) {
        return false
      }

      const dataUpdate = { ...result.rows[0], ...input }

      await client.query(
        'UPDATE prod_promocion SET cantidad = $1 WHERE id_producto = $2 AND id_promocion = $3 RETURNING *;',
        [dataUpdate.cantidad, id, dataUpdate.id_promocion]
      )
      const dataActualizada = await client.query(
        'SELECT * FROM prod_promocion WHERE id_producto = $1',
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

  static async delete({ id_producto, id_promocion }) {
    let client
    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM prod_promocion WHERE id_producto = $1 AND id_promocion = $2',
        [id_producto, id_promocion]
      )

      if (result.rows.length > 0) {
        await client.query(
          'DELETE FROM prod_promocion WHERE id_producto = $1 AND id_promocion = $2 RETURNING *;',
          [id_producto, id_promocion]
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
