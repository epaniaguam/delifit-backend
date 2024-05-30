import { pool } from "../../db/conexion.js";

export class PromocionModel {
  static async getAll({ dia_promocion, nombre, visibilidad }) {
    let client;
    try {
      client = await pool.connect();

      if (dia_promocion) {
        const result = await client.query(
          "SELECT * FROM promocion WHERE dia_promocion = $1 AND visibilidad=true ;",
          [dia_promocion],
        );
        // console.log(result.rows);
        return result.rows;
      }
      if (nombre) {
        const result = await client.query(
          "SELECT * FROM promocion WHERE LOWER(nombre) = LOWER($1) AND visibilidad=true;",
          [nombre],
        );
        return result.rows;
      }
      if (visibilidad) {
        const result = await client.query(
          "SELECT * FROM promocion WHERE visibilidad = $1;",
          [visibilidad],
        );
        return result.rows;
      }

      const result = await client.query(
        "SELECT * FROM promocion WHERE visibilidad=true;",
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
        "SELECT * FROM promocion WHERE id_promocion = $1 AND visibilidad=true",
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

    const {
      img_url,
      nombre,
      descripcion,
      precio_base,
      categoria,
      precio_oferta,
      estado_promocion,
      dia_promocion,
      fecha_inicio,
      fecha_fin,
    } = input;
    try {
      client = await pool.connect();

      // Verificar si ya existe un promocion desabilitado con los mismos datos y actualizarlo
      const dataSame = await client.query(
        "SELECT id_promocion FROM promocion WHERE nombre = $1 AND visibilidad = false;",
        [nombre],
      );

      if (dataSame.rows.length > 0) {
        input = { ...input, visibilidad: true };
        const id = dataSame.rows[0].id_promocion;
        return PromocionModel.update({ id, input });
      }
      // Si no existe, se crea un nuevo
      const result = await client.query(
        "SELECT public.registrar_promocion($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          img_url,
          nombre,
          descripcion,
          precio_base,
          categoria,
          precio_oferta,
          estado_promocion,
          dia_promocion,
          fecha_inicio,
          fecha_fin,
        ],
      );
      // console.log(result.rows);
      return result.rows[0];
    } catch (error) {
      console.error("Error executing query MODEL", error.message);
      throw error.message; // throw error para que el contdia_promocionador lo maneje
    } finally {
      client.release();
    }
  }

  static async update({ id, input }) {
    let client;

    try {
      client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM promocion WHERE id_promocion = $1",
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
        "UPDATE promocion SET img_url = $1, nombre = $2, descripcion = $3, precio_base = $4, categoria = $5, precio_oferta = $6, estado_promocion = $7, dia_promocion = $8, fecha_inicio = $9, fecha_fin = $10, visibilidad = $11 WHERE id_promocion = $12",
        [
          dataUpdate.img_url,
          dataUpdate.nombre,
          dataUpdate.descripcion,
          dataUpdate.precio_base,
          dataUpdate.categoria,
          dataUpdate.precio_oferta,
          dataUpdate.estado_promocion,
          dataUpdate.dia_promocion,
          dataUpdate.fecha_inicio,
          dataUpdate.fecha_fin,
          dataUpdate.visibilidad,
          id,
        ],
      );

      const dataActualizada = await client.query(
        "SELECT * FROM promocion WHERE id_promocion = $1",
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
        "SELECT * FROM promocion WHERE id_promocion = $1",
        [id],
      );

      if (result.rows.length > 0) {
        await client.query(
          "UPDATE promocion SET visibilidad=$1 WHERE id_promocion = $2",
          [false, id],
        );
        // await client.query("DELETE FROM promocion WHERE id_promocion = $1", [id]);
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
