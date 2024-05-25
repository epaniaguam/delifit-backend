import { pool } from "../../db/conexion.js";

export class InsumoModel {
  static async getAll({ nombre, categoria }) {
    let client;
    try {
      client = await pool.connect();

      if (nombre) {
        const result = await client.query(
          "SELECT * FROM insumo WHERE nombre = $1;",
          [nombre],
        );
        return result.rows;
      }
      if (categoria) {
        const result = await client.query(
          "SELECT * FROM insumo WHERE categoria = $1;",
          [categoria],
        );
        return result.rows;
      }

      const result = await client.query("SELECT * FROM insumo");
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
        "SELECT * FROM insumo WHERE id_insumo = $1",
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

    const { img_url, nombre, cantidad, categoria, medida } = input;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT public.registrar_insumo($1, $2, $3, $4, $5)",
        [img_url, nombre, cantidad, categoria, medida],
      );
      // return result.rows[0].registrar_insumo;
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
        "SELECT * FROM insumo WHERE id_insumo = $1",
        [id],
      );

      if (result.rows.length === 0) {
        return false;
      }
      const dataUpdate = { ...result.rows[0], ...input };

      await client.query(
        "UPDATE insumo SET img_url=$1, nombre=$2, cantidad=$3, categoria=$4, medida=$5 WHERE id_insumo = $6",
        [
          dataUpdate.img_url,
          dataUpdate.nombre,
          dataUpdate.cantidad,
          dataUpdate.categoria,
          dataUpdate.medida,
          id,
        ],
      );
      const dataActualizada = await client.query(
        "SELECT * FROM insumo WHERE id_insumo = $1",
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
        "SELECT * FROM insumo WHERE id_insumo = $1",
        [id],
      );

      // console.log(result.rows);

      if (result.rows.length > 0) {
        await client.query("DELETE FROM insumo WHERE id_insumo = $1", [id]);
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
