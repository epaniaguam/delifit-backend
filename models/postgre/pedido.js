import { pool } from '../../db/conexion.js'

export class PedidoModel {
  static async getAll({ fecha_emision, visibilidad }) {
    let client
    try {
      client = await pool.connect()

      if (visibilidad) {
        const result = await client.query(
          'SELECT * FROM pedido WHERE visibilidad = $1;',
          [visibilidad]
        )
        return result.rows
      }

      if (fecha_emision) {
        const result = await client.query(
          'SELECT * FROM pedido WHERE fecha_emision = $1 AND visibilidad=true;',
          [fecha_emision]
        )
        return result.rows
      }

      const result = await client.query(
        'SELECT * FROM pedido WHERE visibilidad=true;'
      )
      return result.rows
    } catch (error) {
      console.error('Error executing query', error.message)
      return error
    } finally {
      client.release()
    }
  }

  static async getById({ id_pedido, id_usuario }) {
    let client
    // console.log("id_pedido:", id_pedido);
    try {
      client = await pool.connect()
      if (!id_usuario) {
        const result = await client.query(
          'SELECT * FROM pedido WHERE id_pedido = $1 AND visibilidad=true;',
          [id_pedido]
        )
        return result.rows
      }

      const result = await client.query(
        'SELECT * FROM pedido WHERE id_pedido = $1 AND id_usuario = $2 AND visibilidad=true;',
        [id_pedido, id_usuario]
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

      // La EVALUACION DE LA VISIBILIDAD AUN SE DEBE PENSAR BIEN
      // PORQUE NO TENEMOS CON QUE COMPARARLO EXACTAMENTE

      // Verificar si ya existe un pedido existe desactivado para actualizarlo en vez de crearlo
      const dataSame = await client.query(
        'SELECT id_pedido FROM pedido WHERE fecha_emision=$1 AND subtotal=$2 AND descuento_promocion=$3 AND descuento_puntos=$4 AND impuesto=$5 AND total=$6 AND id_usuario=$7 AND visibilidad = false;',
        [
          input.fecha_emision,
          input.subtotal,
          input.descuento_promocion,
          input.descuento_puntos,
          input.impuesto,
          input.total,
          input.id_usuario
        ]
      )
      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true }
        const id = dataSame.rows[0].id_pedido
        console.log('id:', id)
        return PedidoModel.update({ id, input })
      }

      const result = await client.query(
        'SELECT registrar_pedido($1, $2, $3, $4, $5, $6, $7, $8);',
        [
          input.id_pedido,
          input.fecha_emision,
          input.subtotal,
          input.descuento_promocion,
          input.descuento_puntos,
          input.impuesto,
          input.total,
          input.id_usuario
        ]
      )
      // console.log("result:", result.rows);
      return result.rows
    } catch (error) {
      console.error('Error executing query', error.message)
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
        'SELECT * FROM pedido WHERE id_pedido = $1;',
        [id]
      )
      // console.log("result:", result.rows);
      if (result.rows.length === 0) {
        return false
      }

      const dataUpdate = { ...result.rows[0], ...input }

      await client.query(
        'UPDATE pedido SET id_usuario=$1, fecha_emision=$2, subtotal=$3, descuento_promocion=$4, descuento_puntos=$5, impuesto=$6, total=$7, visibilidad=$8 WHERE id_pedido=$9 RETURNING *;',
        [
          dataUpdate.id_usuario,
          dataUpdate.fecha_emision,
          dataUpdate.subtotal,
          dataUpdate.descuento_promocion,
          dataUpdate.descuento_puntos,
          dataUpdate.impuesto,
          dataUpdate.total,
          dataUpdate.visibilidad,
          id
        ]
      )
      const dataActualizada = await client.query(
        'SELECT * FROM pedido WHERE id_pedido = $1',
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

  static async delete({ id_pedido, id_usuario }) {
    let client
    try {
      client = await pool.connect()
      let result
      if (!id_usuario) {
        result = await client.query(
          'SELECT * FROM pedido WHERE id_pedido = $1',
          [id_pedido]
        )
      } else {
        result = await client.query(
          'SELECT * FROM pedido WHERE id_pedido = $1 AND id_usuario = $2',
          [id_pedido, id_usuario]
        )
      }

      if (result.rows.length > 0) {
        if (!id_usuario) {
          await client.query(
            'UPDATE pedido SET visibilidad=$1 WHERE id_pedido = $2 RETURNING *;',
            [false, id_pedido]
          )
          return true
        }

        await client.query(
          'UPDATE pedido SET visibilidad=$1 WHERE id_pedido = $2 AND id_usuario = $3 RETURNING *;',
          [false, id_pedido, id_usuario]
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
