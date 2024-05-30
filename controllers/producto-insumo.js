export class ProductoInsumoController {
  constructor({ productoInsumoModel }) {
    this.productoInsumoModel = productoInsumoModel;
  }

  getAll = async (req, res) => {
    const { id_producto, id_insumo } = req.query;
    const filteredData = await this.productoInsumoModel.getAll({
      id_producto,
      id_insumo,
    });

    if (!filteredData)
      return res.status(404).json({ message: "No producto_insumo found" });

    res.status(200).json(filteredData);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const result = await this.productoInsumoModel.getById({
      id,
    });

    if (result) return res.status(200).json(result);
    return res.status(404).json({ message: "ProductoInsumo not found" });
  };

  create = async (req, res) => {
    const result = req.body;

    try {
      const newData = await this.productoInsumoModel.create({ input: result });

      return res.status(201).json(newData);
    } catch (error) {
      if (error === "Insumo ya registrado en el producto") {
        return res
          .status(409)
          .json({ message: "Insumo ya registrado en el producto" });
      }
      return res.status(500).json({ error: "Error creando ProductoInsumo" });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id is required" });
    const result = req.body;

    try {
      const updatedData = await this.productoInsumoModel.update({
        id,
        input: result,
      });

      if (updatedData === false)
        return res.status(404).json({ message: "Producto - Insumo not found" });

      return res.status(200).json(updatedData);
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: "Data format incorrect" });
      }
      return res
        .status(500)
        .json({ error: "Error actualizando Producto - Insumo" });
    }
  };

  delete = async (req, res) => {
    const { id_producto, id_insumo } = req.params;

    try {
      const deletedData = await this.productoInsumoModel.delete({
        id_producto,
        id_insumo,
      });

      if (deletedData === false)
        return res.status(404).json({ message: "ProductoInsumo not found" });

      return res.status(200).json(deletedData);
    } catch (error) {
      return res.status(500).json({ error: "Error deleting ProductoInsumo" });
    }
  };
}
