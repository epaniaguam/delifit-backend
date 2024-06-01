export class PedidoController {
  constructor({ pedidoModel }) {
    this.pedidoModel = pedidoModel;
  }

  getAll = async (req, res) => {
    const { fecha_emision, visibilidad } = req.query;

    if (visibilidad !== undefined) {
      if (visibilidad !== "true" && visibilidad !== "false") {
        return res.status(400).json({ message: "visibilidad debe ser bool" });
      }
    }
    const filteredData = await this.pedidoModel.getAll({
      fecha_emision,
      visibilidad,
    });

    if (!filteredData)
      return res.status(404).json({ message: "Pedido no encontrado" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id_pedido, id_usuario } = req.params;
    const result = await this.pedidoModel.getById({
      id_pedido,
      id_usuario,
    });

    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Pedido no encontrado" });
  };

  create = async (req, res) => {
    const result = req.body;

    try {
      const newData = await this.pedidoModel.create({
        input: result,
      });

      return res.status(201).json(newData);
    } catch (error) {
      if (error.message.includes("El pedido ya existe")) {
        return res.status(409).json({ message: "Pedido ya agregado" });
      }
      return res.status(500).json({ error: "Error creando Pedido" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.pedidoModel.update({
        id,
        input: result,
      });

      if (updatedData === false)
        return res.status(404).json({ message: "Pedido no encontrado" });

      return res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Data format incorrect" });
      }
      return res.status(500).json({ error: "Error actualizando Pedido" });
    }
  };

  delete = async (req, res) => {
    const { id_pedido, id_usuario } = req.params;

    try {
      const deletedData = await this.pedidoModel.delete({
        id_pedido,
        id_usuario,
      });

      if (deletedData === false)
        return res.status(404).json({ message: "Pedido no encontrado" });

      return res.status(200).json(deletedData);
    } catch (error) {
      return res.status(500).json({ error: "Error deleting Pedido" });
    }
  };
}
