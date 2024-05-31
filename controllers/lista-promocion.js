export class ListaPromocionController {
  constructor({ listaPromocionModel }) {
    this.listaPromocionModel = listaPromocionModel;
  }

  getAll = async (req, res) => {
    const filteredData = await this.listaPromocionModel.getAll();

    if (!filteredData)
      return res.status(404).json({ message: "Lista-promocion no encontrado" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id_pedido, id_promocion } = req.params;
    const result = await this.listaPromocionModel.getById({
      id_pedido,
      id_promocion,
    });

    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Lista-promocion no encontrado" });
  };

  create = async (req, res) => {
    const result = req.body;

    try {
      const newData = await this.listaPromocionModel.create({
        input: result,
      });

      return res.status(201).json(newData);
    } catch (error) {
      if (error.message.includes("El registro ya existe")) {
        return res
          .status(409)
          .json({ message: "Promocion ya agregado a la lista" });
      }
      return res.status(500).json({ error: "Error creando ListaPromocion" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.listaPromocionModel.update({
        id,
        input: result,
      });

      if (updatedData === false)
        return res
          .status(404)
          .json({ message: "Lista-promocion no encontrado" });

      return res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Data format incorrect" });
      }
      return res
        .status(500)
        .json({ error: "Error actualizando Lista-promocion" });
    }
  };

  delete = async (req, res) => {
    const { id_pedido, id_promocion } = req.params;

    try {
      const deletedData = await this.listaPromocionModel.delete({
        id_pedido,
        id_promocion,
      });

      if (deletedData === false)
        return res
          .status(404)
          .json({ message: "Lista-promocion no encontrado" });

      return res.status(200).json(deletedData);
    } catch (error) {
      return res.status(500).json({ error: "Error deleting Lista-promocion" });
    }
  };
}
