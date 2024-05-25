// import { validateMovie, validateParcialMovie } from '../schemas/movies.js'

export class PersonalController {
  constructor({ personalModel }) {
    this.personalModel = personalModel;
  }

  getAll = async (req, res) => {
    const { rol, validacion } = req.query;

    if (validacion !== undefined) {
      if (validacion !== "true" && validacion !== "false") {
        return res.status(400).json({ message: "Validacion debe bool" });
      }
    }

    const filteredData = await this.personalModel.getAll({ rol, validacion });
    // console.log("filteredData:", filteredData);

    if (!filteredData)
      return res.status(404).json({ message: "No personals found" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.personalModel.getById({ id });
    // console.log("result:", result);
    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Personal not found" });
  };

  create = async (req, res) => {
    // to do : validar datos con zod
    // const result = validateUsuario(req.body)
    const result = req.body;

    try {
      const newData = await this.personalModel.create({ input: result });
      // console.log("newData:", newData);

      res.status(201).json(newData);
    } catch (error) {
      if (error === "Personal ya registrado en la base de datos") {
        // console.log(error);
        res.status(409).json({ message: "Personal ya existe" });
      } else {
        res.status(500).json({ error: "Error creando Personal" });
      }
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.personalModel.update({
        id,
        input: result,
      });
      // console.log("updatedData:", updatedData);

      if (updatedData === false)
        return res.status(404).json({ message: "Personal not found" });

      res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error actualizando Personal" });
      }
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });

    try {
      const deletedData = await this.personalModel.delete({ id });
      // console.log("deletedData:", deletedData);

      if (deletedData === false)
        return res.status(404).json({ message: "Personal not found" });

      res.status(200).json({ message: "Personal deleted" });
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error deleting Personal" });
      }
    }
  };
}
