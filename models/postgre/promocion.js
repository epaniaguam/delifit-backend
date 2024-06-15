import { pool } from '../../db/conexion.js'

export class PromocionModel {
  static async getAll({ dia_promocion, nombre, visibilidad, categoria }) {
    let client
    try {
      client = await pool.connect()

      if (categoria) {
        const result = await client.query(
          'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE c.descripcion_categoria = $1 AND p.visibilidad = true ORDER BY id_promocion ASC;',
          [categoria]
        )
        return result.rows
      }
      if (dia_promocion) {
        const result = await client.query(
          'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE dia_promocion = $1 AND p.visibilidad = true ORDER BY id_promocion ASC;',
          [dia_promocion]
        )
        return result.rows
      }
      if (nombre) {
        const result = await client.query(
          'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE LOWER(nombre) = LOWER($1) AND p.visibilidad = true ORDER BY id_promocion ASC;',
          [nombre]
        )
        return result.rows
      }
      if (visibilidad) {
        const result = await client.query(
          'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE p.visibilidad = $1 ORDER BY id_promocion ASC;',
          [visibilidad]
        )
        return result.rows
      }

      const result = await client.query(
        'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE p.visibilidad = true ORDER BY id_promocion ASC;'
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
        'SELECT id_promocion, img_url, nombre, descripcion, precio_base, precio_oferta, c.descripcion_categoria AS categoria, p.id_categoria, estado_promocion, dia_promocion, fecha_inicio, fecha_fin, p.visibilidad FROM promocion p INNER JOIN categoria c ON p.id_categoria = c.id_categoria WHERE id_promocion = $1 AND p.visibilidad = true',
        [id]
      )
      // console.log(result.rows);
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
    const {
      img_url,
      nombre,
      descripcion,
      precio_base,
      id_categoria,
      precio_oferta,
      estado_promocion,
      dia_promocion,
      fecha_inicio,
      fecha_fin
    } = input
    try {
      client = await pool.connect()

      // Verificar si ya existe un promocion desabilitado con los mismos datos y actualizarlo
      const dataSame = await client.query(
        'SELECT id_promocion FROM promocion WHERE nombre = $1 AND visibilidad = false;',
        [nombre]
      )

      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true }
        const id = dataSame.rows[0].id_promocion
        return PromocionModel.update({ id, input })
      }
      // Si no existe, se crea un nuevo
      const result = await client.query(
        'SELECT public.registrar_promocion($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          img_url,
          nombre,
          descripcion,
          precio_base,
          id_categoria,
          precio_oferta,
          estado_promocion,
          dia_promocion,
          fecha_inicio,
          fecha_fin
        ]
      )
      // console.log(result.rows);
      return result.rows[0]
    } catch (error) {
      console.error('Error executing query MODEL', error.message)
      throw error.message // throw error para que el contdia_promocionador lo maneje
    } finally {
      client.release()
    }
  }

  static async update({ id, input }) {
    let client

    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM promocion WHERE id_promocion = $1',
        [id]
      )

      if (result.rows.length === 0) {
        return false
      }

      const dataUpdate = { ...result.rows[0], ...input }
      // console.log(dataUpdate);
      await client.query(
        'UPDATE promocion SET img_url = $1, nombre = $2, descripcion = $3, precio_base = $4, id_categoria = $5, precio_oferta = $6, estado_promocion = $7, dia_promocion = $8, fecha_inicio = $9, fecha_fin = $10, visibilidad = $11 WHERE id_promocion = $12',
        [
          dataUpdate.img_url,
          dataUpdate.nombre,
          dataUpdate.descripcion,
          dataUpdate.precio_base,
          dataUpdate.id_categoria,
          dataUpdate.precio_oferta,
          dataUpdate.estado_promocion,
          dataUpdate.dia_promocion,
          dataUpdate.fecha_inicio,
          dataUpdate.fecha_fin,
          dataUpdate.visibilidad,
          id
        ]
      )

      const dataActualizada = await client.query(
        'SELECT * FROM promocion WHERE id_promocion = $1',
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
        'SELECT * FROM promocion WHERE id_promocion = $1',
        [id]
      )

      if (result.rows.length > 0) {
        await client.query(
          'UPDATE promocion SET visibilidad = $1 WHERE id_promocion = $2',
          [false, id]
        )
        // await client.query("DELETE FROM promocion WHERE id_promocion = $1", [id]);
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
