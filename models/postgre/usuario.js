import { pool } from "../../db/conexion.js";

export class UsuarioModel {
  static async getAll({ telefono }) {
    let client;
    try {
      client = await pool.connect();

      if (telefono) {
        const result = await client.query(
          "SELECT * FROM usuario WHERE telefono = $1;",
          [telefono],
        );
        // console.log(result.rows);
        return result.rows[0];
      }

      const result = await client.query("SELECT * FROM usuario");
      return result.rows;
    } catch (error) {
      console.error("Error executing query", error.message);
      return error;
    } finally {
      client.release();
    }
  }

  static async getById({ id }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id],
      );
      // console.log(result.rows);
      return result.rows[0];
    } catch (error) {
      console.error("Error executing query", error.message);
      return error;
    } finally {
      client.release();
    }
  }

  static async create({ input }) {
    let client;
    // console.log("input: ", input);
    const { nombre, apellido, img_url, telefono, documento, puntos, tipo_doc } =
      input;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT public.registrar_usuario($1, $2, $3, $4, $5, $6, $7)",
        [img_url, nombre, apellido, documento, puntos, tipo_doc, telefono],
      );
      // console.log(result.rows);
      return result.rows[0];
    } catch (error) {
      console.error("Error executing query MODEL", error.message);
      throw error.message; // throw error para que el controlador lo maneje
    } finally {
      client.release();
    }
  }

  static async update({ id, input }) {
    let client;

    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id],
      );
      console.log("result:", result.rows);
      console.log("resultL:", result.rows.length);
      if (result.rows.length === 0) {
        return false;
      }

      // Actualizamos usuario
      const dataUpdate = { ...result.rows[0], ...input };
      // console.log("dataUpdate:", dataUpdate);
      await client.query(
        "UPDATE usuario SET nombre = $1, apellido = $2, img_url = $3, telefono = $4, documento = $5, puntos = $6, tipo_doc = $7 WHERE id_usuario = $8",
        [
          dataUpdate.nombre,
          dataUpdate.apellido,
          dataUpdate.img_url,
          dataUpdate.telefono,
          dataUpdate.documento,
          dataUpdate.puntos,
          dataUpdate.tipo_doc,
          id,
        ],
      );

      const dataActualizada = await client.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id],
      );

      // console.log(result.rows);
      return dataActualizada.rows[0];
    } catch (error) {
      console.error("Error executing query", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete({ id }) {
    let client;
    try {
      client = await pool.connect();
      const usuario = await client.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id],
      );

      console.log(usuario.rows);

      if (usuario.rows.length > 0) {
        const result = await client.query(
          "DELETE FROM usuario WHERE id_usuario = $1",
          [id],
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error executing query", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
}
