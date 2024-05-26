import { pool } from "../../db/conexion.js";

export class PersonalModel {
  static async getAll({ rol, validacion, visibilidad }) {
    let client;
    try {
      client = await pool.connect();

      if (rol) {
        const result = await client.query(
          "SELECT * FROM personal WHERE rol = $1 AND visibilidad=true ;",
          [rol],
        );
        // console.log(result.rows);
        return result.rows;
      }
      if (validacion) {
        const result = await client.query(
          "SELECT * FROM personal WHERE validacion = $1 AND visibilidad=true;",
          [validacion],
        );
        // console.log(result.rows);
        return result.rows;
      }
      if (visibilidad) {
        const result = await client.query(
          "SELECT * FROM personal WHERE visibilidad = $1;",
          [visibilidad],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM personal WHERE visibilidad=true;",
      );
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
        "SELECT * FROM personal WHERE id_personal = $1 AND visibilidad=true",
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
    const { nombre, apellido, contrasena, documento, telefono, tipo_doc, rol } =
      input;
    try {
      client = await pool.connect();

      // Verificar si ya existe un personal desabilitado con los mismos datos y actualizarlo
      const dataSame = await client.query(
        "SELECT id_personal FROM personal WHERE documento = $1 AND visibilidad = false;",
        [documento],
      );

      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true };
        const id = dataSame.rows[0].id_personal;
        return PersonalModel.update({ id, input });
      }
      // Si no existe, se crea un nuevo
      const result = await client.query(
        "SELECT public.registrar_personal($1, $2, $3, $4, $5, $6, $7)",
        [nombre, apellido, contrasena, documento, telefono, tipo_doc, rol],
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
        "SELECT * FROM personal WHERE id_personal = $1",
        [id],
      );
      // console.log("result:", result.rows);
      // console.log("resultL:", result.rows.length);
      if (result.rows.length === 0) {
        return false;
      }

      const dataUpdate = { ...result.rows[0], ...input };
      // console.log(dataUpdate);
      await client.query(
        "UPDATE personal SET nombre = $1, apellido = $2, contrasena = $3, documento = $4, telefono= $5, tipo_doc = $6, rol = $7, validacion = $8, visibilidad = $9 WHERE id_personal = $10",
        [
          dataUpdate.nombre,
          dataUpdate.apellido,
          dataUpdate.contrasena,
          dataUpdate.documento,
          dataUpdate.telefono,
          dataUpdate.tipo_doc,
          dataUpdate.rol,
          dataUpdate.validacion,
          dataUpdate.visibilidad,
          id,
        ],
      );

      const dataActualizada = await client.query(
        "SELECT * FROM personal WHERE id_personal = $1",
        [id],
      );

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
      const result = await client.query(
        "SELECT * FROM personal WHERE id_personal = $1",
        [id],
      );

      // console.log(result.rows);

      if (result.rows.length > 0) {
        await client.query(
          "UPDATE personal SET visibilidad=$1 WHERE id_personal = $2",
          [false, id],
        );
        // await client.query("DELETE FROM personal WHERE id_personal = $1", [id]);
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
