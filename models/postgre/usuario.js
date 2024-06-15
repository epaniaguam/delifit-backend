import { pool } from '../../db/conexion.js'

export class UsuarioModel {
  static async getAll({ telefono, validacion, visibilidad }) {
    let client
    try {
      client = await pool.connect()
      if (telefono) {
        const result = await client.query(
          'SELECT * FROM usuario WHERE telefono = $1 AND visibilidad=true;',
          [telefono]
        )
        // console.log(result.rows);
        return result.rows
      }
      if (validacion) {
        const result = await client.query(
          'SELECT * FROM usuario WHERE validacion = $1 AND visibilidad=true;',
          [validacion]
        )
        // console.log(result.rows);
        return result.rows
      }
      if (visibilidad) {
        const result = await client.query(
          'SELECT * FROM usuario WHERE visibilidad = $1;',
          [visibilidad]
        )
        return result.rows
      }

      const result = await client.query(
        'SELECT * FROM usuario WHERE visibilidad = true;'
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
        'SELECT * FROM usuario WHERE id_usuario = $1 AND visibilidad=true;',
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
    // console.log("input: ", input);
    const { nombre, apellido, img_url, telefono, documento, tipo_doc } = input
    try {
      client = await pool.connect()

      // Verificar si ya existe un usuario desabilitado con los mismos datos
      const dataSame = await client.query(
        'SELECT id_usuario FROM usuario WHERE nombre = $1 AND apellido= $2 AND documento = $3 AND visibilidad = false;',
        [nombre, apellido, documento]
      )

      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true }
        const id = dataSame.rows[0].id_usuario
        return UsuarioModel.update({ id, input })
      }
      // Si no existe, se crea un nuevo usuario
      const result = await client.query(
        'SELECT public.registrar_usuario($1, $2, $3, $4, $5, $6)',
        [img_url, nombre, apellido, documento, tipo_doc, telefono]
      )

      return result.rows[0]
      // console.log(result.rows);
    } catch (error) {
      console.error('Error executing query MODEL', error.message)
      throw error.message // throw error para que el controlador lo maneje
    } finally {
      client.release()
    }
  }

  static async update({ id, input }) {
    let client

    try {
      client = await pool.connect()
      const result = await client.query(
        'SELECT * FROM usuario WHERE id_usuario = $1',
        [id]
      )
      // console.log("result:", result.rows);
      // console.log("resultL:", result.rows.length);
      if (result.rows.length === 0) {
        return false
      }

      // Actualizamos usuario
      const dataUpdate = { ...result.rows[0], ...input }
      // console.log("dataUpdate:", dataUpdate);
      await client.query(
        'UPDATE usuario SET nombre = $1, apellido = $2, img_url = $3, telefono = $4, documento = $5, puntos = $6, tipo_doc = $7, validacion = $8, visibilidad = $9 WHERE id_usuario = $10',
        [
          dataUpdate.nombre,
          dataUpdate.apellido,
          dataUpdate.img_url,
          dataUpdate.telefono,
          dataUpdate.documento,
          dataUpdate.puntos,
          dataUpdate.tipo_doc,
          dataUpdate.validacion,
          dataUpdate.visibilidad,
          id
        ]
      )

      const dataActualizada = await client.query(
        'SELECT * FROM usuario WHERE id_usuario = $1',
        [id]
      )

      // console.log(result.rows);
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
        'SELECT * FROM usuario WHERE id_usuario = $1',
        [id]
      )

      // console.log(result.rows);

      if (result.rows.length > 0) {
        await client.query(
          'UPDATE usuario SET visibilidad=$1 WHERE id_usuario = $2',
          [false, id]
        )
        // await client.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
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
