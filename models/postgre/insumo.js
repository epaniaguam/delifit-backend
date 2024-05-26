import { pool } from "../../db/conexion.js";

export class InsumoModel {
  static async getAll({ nombre, categoria, visibilidad }) {
    let client;
    try {
      client = await pool.connect();

      if (nombre) {
        const result = await client.query(
          "SELECT * FROM insumo WHERE nombre = $1 AND visibilidad=true;",
          [nombre],
        );
        return result.rows;
      }
      if (categoria) {
        const result = await client.query(
          "SELECT * FROM insumo WHERE categoria = $1 AND visibilidad=true;",
          [categoria],
        );
        return result.rows;
      }
      if (visibilidad) {
        const result = await client.query(
          "SELECT * FROM insumo WHERE visibilidad = $1;",
          [visibilidad],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM insumo WHERE visibilidad=true;",
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
        "SELECT * FROM insumo WHERE id_insumo = $1 AND visibilidad=true;",
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

      // Verificar si ya existe un producto con el mismo nombre y precio para actualizarlo en vez de crearlo
      const dataSame = await client.query(
        "SELECT id_insumo FROM insumo WHERE nombre = $1 AND visibilidad = false;",
        [nombre],
      );
      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true };
        const id = dataSame.rows[0].id_insumo;

        return InsumoModel.update({ id, input });
      }

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
        "UPDATE insumo SET img_url=$1, nombre=$2, cantidad=$3, categoria=$4, medida=$5, visibilidad=$6 WHERE id_insumo = $7",
        [
          dataUpdate.img_url,
          dataUpdate.nombre,
          dataUpdate.cantidad,
          dataUpdate.categoria,
          dataUpdate.medida,
          dataUpdate.visibilidad,
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

      if (result.rows.length > 0) {
        await client.query(
          "UPDATE insumo SET visibilidad=$1 WHERE id_insumo = $2",
          [false, id],
        );
        // await client.query("DELETE FROM insumo WHERE id_insumo = $1", [id]);
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
