import { pool } from "../../db/conexion.js";

export class ListaProductoModel {
  static async getAll() {
    let client;
    try {
      client = await pool.connect();

      const result = await client.query("SELECT * FROM lista_producto;");
      return result.rows;
    } catch (error) {
      console.error("Error executing query", error.message);
      return error;
    } finally {
      client.release();
    }
  }

  static async getById({ id_pedido, id_producto }) {
    let client;
    try {
      client = await pool.connect();

      if (!id_producto) {
        const result = await client.query(
          "SELECT * FROM lista_producto WHERE id_pedido = $1;",
          [id_pedido],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM lista_producto WHERE id_pedido = $1 AND id_producto = $2;",
        [id_pedido, id_producto],
      );
      return result.rows;
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
        "SELECT registrar_lista_producto($1, $2, $3, $4, $5);",
        [
          input.id_producto,
          input.cantidad,
          input.id_pedido,
          input.precio_cantidad,
          input.nombre,
        ],
      );
      // console.log("result:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error executing query", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update({ id, input }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM lista_producto WHERE id_pedido = $1;",
        [id],
      );
      // console.log("result:", result.rows);
      if (result.rows.length === 0) {
        return false;
      }

      const dataUpdate = { ...result.rows[0], ...input };

      await client.query(
        "UPDATE lista_producto SET cantidad = $1, precio_cantidad = $2, nombre = $3 WHERE id_pedido = $4 AND id_producto = $5 RETURNING *;",
        [
          dataUpdate.cantidad,
          dataUpdate.precio_cantidad,
          dataUpdate.nombre,
          id,
          dataUpdate.id_producto,
        ],
      );
      const dataActualizada = await client.query(
        "SELECT * FROM lista_producto WHERE id_pedido = $1",
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

  static async delete({ id_pedido, id_producto }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM lista_producto WHERE id_pedido = $1 AND id_producto = $2",
        [id_pedido, id_producto],
      );

      if (result.rows.length > 0) {
        await client.query(
          "DELETE FROM lista_producto WHERE id_pedido = $1 AND id_producto = $2 RETURNING *;",
          [id_pedido, id_producto],
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
