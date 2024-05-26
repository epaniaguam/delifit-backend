import { pool } from "../../db/conexion.js";

export class ProductoModel {
  static async getAll({ precio, categoria }) {
    let client;
    try {
      client = await pool.connect();

      if (precio) {
        const result = await client.query(
          "SELECT * FROM producto WHERE precio_base = $1;",
          [precio],
        );
        return result.rows;
      }
      if (categoria) {
        const result = await client.query(
          "SELECT * FROM producto WHERE categoria = $1;",
          [categoria],
        );
        return result.rows;
      }

      const result = await client.query("SELECT * FROM producto");
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
        "SELECT * FROM producto WHERE id_producto = $1",
        [id],
      );
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

    const { img_url, nombre, descripcion, precio_base, categoria } = input;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT public.registrar_producto($1, $2, $3, $4, $5)",
        [img_url, nombre, descripcion, precio_base, categoria],
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error executing query", error.message);
      throw error.message;
    } finally {
      client.release();
    }
  }

  static async update({ id, input }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM producto WHERE id_producto = $1",
        [id],
      );

      if (result.rows.length === 0) {
        return false;
      }

      const dataUpdate = { ...result.rows[0], ...input };
      await client.query(
        "UPDATE producto SET img_url=$1, nombre=$2, descripcion=$3, precio_base=$4, categoria=$5, visibilidad=$6 WHERE id_producto = $7",
        [
          dataUpdate.img_url,
          dataUpdate.nombre,
          dataUpdate.descripcion,
          dataUpdate.precio_base,
          dataUpdate.categoria,
          dataUpdate.visibilidad,
          id,
        ],
      );
      const dataActualizada = await client.query(
        "SELECT * FROM producto WHERE id_producto = $1",
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
        "SELECT * FROM producto WHERE id_producto = $1",
        [id],
      );

      // console.log(result.rows);

      if (result.rows.length > 0) {
        await client.query("DELETE FROM producto WHERE id_producto = $1", [id]);
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
