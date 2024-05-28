import { pool } from "../../db/conexion.js";

export class ProductoInsumoModel {
  static async getAll({ id_producto, id_insumo }) {
    let client;
    try {
      client = await pool.connect();

      if (id_producto) {
        const result = await client.query(
          "SELECT * FROM ins_prod WHERE id_producto = $1;",
          [id_producto],
        );
        return result.rows;
      }
      if (id_insumo) {
        const result = await client.query(
          "SELECT * FROM ins_prod WHERE id_insumo = $1;",
          [id_insumo],
        );
        return result.rows;
      }

      const result = await client.query("SELECT * FROM ins_prod;");
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
        "SELECT * FROM ins_prod WHERE id_producto = $1;",
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

    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT registrar_insumo_producto($1, $2,$3);",
        [input.id_producto, input.id_insumo, input.cantidad],
      );
      // console.log("result:", result.rows);
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
        "SELECT * FROM ins_prod WHERE id_producto = $1;",
        [id],
      );
      console.log("result:", result.rows);
      if (result.rows.length === 0) {
        return false;
      }

      const dataUpdate = { ...result.rows[0], ...input };

      await client.query(
        "UPDATE ins_prod SET cantidad = $1 WHERE id_producto = $2 AND id_insumo = $3 RETURNING *;",
        [dataUpdate.cantidad, id, dataUpdate.id_insumo],
      );
      const dataActualizada = await client.query(
        "SELECT * FROM ins_prod WHERE id_producto = $1",
        [id],
      );
      return dataActualizada.rows;
    } catch (error) {
      console.error("Error executing query", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete({ id_producto, id_insumo }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM ins_prod WHERE id_producto = $1 AND id_insumo = $2",
        [id_producto, id_insumo],
      );

      if (result.rows.length > 0) {
        await client.query(
          "DELETE FROM ins_prod WHERE id_producto = $1 AND id_insumo = $2 RETURNING *;",
          [id_producto, id_insumo],
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
