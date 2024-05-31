import { pool } from "../../db/conexion.js";

export class ListaPromocionModel {
  static async getAll() {
    let client;
    try {
      client = await pool.connect();

      const result = await client.query(
        "SELECT * FROM lista_promocion ORDER BY id_pedido;",
      );
      return result.rows;
    } catch (error) {
      console.error("Error executing query", error.message);
      return error;
    } finally {
      client.release();
    }
  }

  static async getById({ id_pedido, id_promocion }) {
    let client;
    try {
      client = await pool.connect();
      if (!id_promocion) {
        const result = await client.query(
          "SELECT * FROM lista_promocion WHERE id_pedido = $1 ORDER BY id_pedido;",
          [id_pedido],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM lista_promocion WHERE id_pedido = $1 AND id_promocion = $2 ORDER BY id_pedido;",
        [id_pedido, id_promocion],
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
        "SELECT registrar_lista_promocion($1, $2, $3, $4, $5);",
        [
          input.id_promocion,
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
        "SELECT * FROM lista_promocion WHERE id_pedido = $1;",
        [id],
      );
      // console.log("result:", result.rows);
      if (result.rows.length === 0) {
        return false;
      }

      const dataUpdate = { ...result.rows[0], ...input };

      await client.query(
        "UPDATE lista_promocion SET cantidad = $1, precio_cantidad = $2, nombre = $3 WHERE id_pedido = $4 AND id_promocion = $5 RETURNING *;",
        [
          dataUpdate.cantidad,
          dataUpdate.precio_cantidad,
          dataUpdate.nombre,
          id,
          dataUpdate.id_promocion,
        ],
      );
      const dataActualizada = await client.query(
        "SELECT * FROM lista_promocion WHERE id_pedido = $1",
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

  static async delete({ id_pedido, id_promocion }) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM lista_promocion WHERE id_pedido = $1 AND id_promocion = $2",
        [id_pedido, id_promocion],
      );

      if (result.rows.length > 0) {
        await client.query(
          "DELETE FROM lista_promocion WHERE id_pedido = $1 AND id_promocion = $2 RETURNING *;",
          [id_pedido, id_promocion],
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
