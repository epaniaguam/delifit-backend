// import { validateMovie, validateParcialMovie } from '../schemas/movies.js'

export class UsuarioController {
  constructor({ usuarioModel }) {
    this.usuarioModel = usuarioModel;
  }

  getAll = async (req, res) => {
    const { telefono, validacion, visibilidad } = req.query;
    if (validacion !== undefined) {
      if (validacion !== "true" && validacion !== "false") {
        return res.status(400).json({ message: "Validacion debe bool" });
      }
    }
    // console.log(validacion);
    if (visibilidad !== undefined) {
      if (visibilidad !== "true" && visibilidad !== "false") {
        return res.status(400).json({ message: "visibilidad debe ser bool" });
      }
    }

    const filteredData = await this.usuarioModel.getAll({
      telefono,
      validacion,
      visibilidad,
    });

    // console.log("filteredData:", filteredData);
    try {
      if (!filteredData)
        return res.status(404).json({ message: "No users found" });

      res.status(200).json(filteredData);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).json({ error: "Error getting users" });
    }
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const usuario = await this.usuarioModel.getById({ id });
    // console.log("usuario:", usuario);
    if (usuario) return res.status(200).json(usuario);
    return res.status(404).json({ message: "Usuario not found" });
  };

  create = async (req, res) => {
    // to do : validar datos con zod
    // const result = validateUsuario(req.body)
    const result = req.body;

    try {
      const newUsuario = await this.usuarioModel.create({ input: result });
      // console.log("newUsuario:", newUsuario);

      res.status(201).json(newUsuario);
    } catch (error) {
      if (error === "Usuario ya registrado en la base de datos") {
        // console.log(error);
        res.status(409).json({ message: "Usuario already exists" });
      } else {
        res.status(500).json({ error: "Error creating user" });
      }
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.usuarioModel.update({
        id,
        input: result,
      });
      // console.log("updatedData:", updatedData);

      if (updatedData === false)
        return res.status(404).json({ message: "Usuario not found" });

      res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error updating user" });
      }
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });

    try {
      const deletedUsuario = await this.usuarioModel.delete({ id });
      // console.log("deletedUsuario:", deletedUsuario);

      if (deletedUsuario === false)
        return res.status(404).json({ message: "Usuario not found" });

      res.status(200).json({ message: "Usuario deleted" });
    } catch (error) {
      if (error.severity) {
        res.status(400).json({ message: "Id format incorrect" });
      } else {
        res.status(500).json({ error: "Error deleting user" });
      }
    }
  };
}
