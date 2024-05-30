// import { validateMovie, validateParcialMovie } from '../schemas/movies.js'

export class PromocionController {
  constructor({ promocionModel }) {
    this.promocionModel = promocionModel;
  }

  getAll = async (req, res) => {
    const { dia_promocion, nombre, visibilidad } = req.query;

    if (visibilidad !== undefined) {
      if (visibilidad !== "true" && visibilidad !== "false") {
        return res.status(400).json({ message: "visibilidad debe ser bool" });
      }
    }

    const filteredData = await this.promocionModel.getAll({
      dia_promocion,
      nombre,
      visibilidad,
    });
    // console.log("filteredData:", filteredData);

    if (!filteredData)
      return res.status(404).json({ message: "Promocion no encontrada" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.promocionModel.getById({ id });
    // console.log("result:", result);
    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Promocion no encontrada" });
  };

  create = async (req, res) => {
    // to do : validar datos con zod
    // const result = validateUsuario(req.body)
    const result = req.body;

    try {
      const newData = await this.promocionModel.create({ input: result });
      // console.log("newData:", newData);

      res.status(201).json(newData);
    } catch (error) {
      if (error === "Promocion ya existe") {
        // console.log(error);
        res.status(409).json({ message: "Promocion ya existe" });
      } else {
        res.status(500).json({ error: "Error creando promocion" });
      }
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.promocionModel.update({
        id,
        input: result,
      });
      // console.log("updatedData:", updatedData);

      if (updatedData === false)
        return res.status(404).json({ message: "Promocion no encontrada" });

      res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error actualizando Promocion" });
      }
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });

    try {
      const deletedData = await this.promocionModel.delete({ id });
      // console.log("deletedData:", deletedData);

      if (deletedData === false)
        return res.status(404).json({ message: "Promocion no encontrada" });

      res.status(200).json({ message: "Promocion deleted" });
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error deleting Promocion" });
      }
    }
  };
}
