export class ListaProductoController {
  constructor({ listaProductoModel }) {
    this.listaProductoModel = listaProductoModel;
  }

  getAll = async (req, res) => {
    const filteredData = await this.listaProductoModel.getAll();

    if (!filteredData)
      return res.status(404).json({ message: "Lista-producto no encontrado" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id_pedido, id_producto } = req.params;
    const result = await this.listaProductoModel.getById({
      id_pedido,
      id_producto,
    });
    if (result.length === 0)
      return res.status(404).json({ message: "ProductoInsumo not found" });

    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "Lista-producto no encontrado" });
  };

  create = async (req, res) => {
    const result = req.body;

    try {
      const newData = await this.listaProductoModel.create({
        input: result,
      });

      return res.status(201).json(newData);
    } catch (error) {
      if (error.message.includes("El registro ya existe")) {
        return res
          .status(409)
          .json({ message: "Producto ya agregado a la lista" });
      }
      return res.status(500).json({ error: "Error creando ListaProducto" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.listaProductoModel.update({
        id,
        input: result,
      });

      if (updatedData === false)
        return res
          .status(404)
          .json({ message: "Lista-Producto no encontrado" });

      return res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Data format incorrect" });
      }
      return res
        .status(500)
        .json({ error: "Error actualizando Lista-Producto" });
    }
  };

  delete = async (req, res) => {
    const { id_pedido, id_producto } = req.params;

    try {
      const deletedData = await this.listaProductoModel.delete({
        id_pedido,
        id_producto,
      });

      if (deletedData === false)
        return res
          .status(404)
          .json({ message: "Lista-producto no encontrado" });

      return res.status(200).json(deletedData);
    } catch (error) {
      return res.status(500).json({ error: "Error deleting Lista-producto" });
    }
  };
}
