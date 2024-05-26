import { pool } from "../../db/conexion.js";

export class ProductoModel {
  static async getAll({ precio, categoria, visibilidad }) {
    let client;
    try {
      client = await pool.connect();

      if (precio) {
        const result = await client.query(
          "SELECT * FROM producto WHERE precio_base = $1 AND visibilidad=true;",
          [precio],
        );
        return result.rows;
      }
      if (categoria) {
        const result = await client.query(
          "SELECT * FROM producto WHERE categoria = $1 AND visibilidad=true;",
          [categoria],
        );
        return result.rows;
      }
      if (visibilidad) {
        const result = await client.query(
          "SELECT * FROM producto WHERE visibilidad = $1;",
          [visibilidad],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM producto WHERE visibilidad=true;",
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
        "SELECT * FROM producto WHERE id_producto = $1 AND visibilidad=true;",
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

      // Verificar si ya existe un producto con el mismo nombre y precio para actualizarlo en vez de crearlo
      const dataSame = await client.query(
        "SELECT id_producto FROM producto WHERE nombre = $1 AND precio_base= $2 AND visibilidad = false;",
        [nombre, precio_base],
      );

      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true };
        const id = dataSame.rows[0].id_producto;
        return ProductoModel.update({ id, input });
      }

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
        await client.query(
          "UPDATE producto SET visibilidad=$1 WHERE id_producto = $2",
          [false, id],
        );
        // await client.query("DELETE FROM producto WHERE id_producto = $1", [id]);
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
