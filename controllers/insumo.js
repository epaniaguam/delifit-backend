// import { validateMovie, validateParcialMovie } from '../schemas/movies.js'

export class InsumoController {
  constructor({ insumoModel }) {
    this.insumoModel = insumoModel;
  }

  getAll = async (req, res) => {
    const { nombre, categoria } = req.query;

    const filteredData = await this.insumoModel.getAll({ nombre, categoria });
    // console.log("filteredData:", filteredData);

    if (!filteredData)
      return res.status(404).json({ message: "No insumo found" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.insumoModel.getById({ id });
    // console.log("result:", result);
    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Insumo not found" });
  };

  create = async (req, res) => {
    // to do : validar datos con zod
    // const result = validateUsuario(req.body)
    const result = req.body;

    try {
      const newData = await this.insumoModel.create({ input: result });
      // console.log("newData:", newData);

      return res.status(201).json(newData);
    } catch (error) {
      if (error === "Insumo ya registrado en la base de datos") {
        // console.log(error);
        return res.status(409).json({ message: "Insumo ya existe" });
      }
      return res.status(500).json({ error: "Error creando Insumo" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.insumoModel.update({
        id,
        input: result,
      });
      // console.log("updatedData:", updatedData);

      if (updatedData === false)
        return res.status(404).json({ message: "Insumo not found" });

      return res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Id format incorrect" });
      }
      return res.status(500).json({ error: "Error actualizando Insumo" });
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });

    try {
      const deletedData = await this.insumoModel.delete({ id });
      // console.log("deletedData:", deletedData);

      if (deletedData === false)
        return res.status(404).json({ message: "Insumo not found" });

      res.status(200).json({ message: "Insumo deleted" });
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Id format incorrect" });
      }
      return res.status(500).json({ error: "Error deleting Insumo" });
    }
  };
}
