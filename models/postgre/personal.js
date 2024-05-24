import { pool } from "../../db/conexion.js";

export class PersonalModel {
  static async getAll({ rol }) {
    let client;
    try {
      client = await pool.connect();

      if (rol) {
        const result = await client.query(
          "SELECT * FROM personal WHERE rol = $1;",
          [rol],
        );
        // console.log(result.rows);
        return result.rows;
      }

      const result = await client.query("SELECT * FROM personal");
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
        "SELECT * FROM personal WHERE id_personal = $1",
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
        "UPDATE personal SET nombre = $1, apellido = $2, contrasena = $3, documento = $4, telefono= $5, tipo_doc = $6, rol = $7, validacion = $8 WHERE id_personal = $9",
        [
          dataUpdate.nombre,
          dataUpdate.apellido,
          dataUpdate.contrasena,
          dataUpdate.documento,
          dataUpdate.telefono,
          dataUpdate.tipo_doc,
          dataUpdate.rol,
          dataUpdate.validacion,
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

      console.log(result.rows);

      if (result.rows.length > 0) {
        await client.query("DELETE FROM personal WHERE id_personal = $1", [id]);
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
