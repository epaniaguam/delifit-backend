export class ProductoPromocionController {
  constructor({ productoPromocionModel }) {
    this.productoPromocionModel = productoPromocionModel
  }

  getAll = async (req, res) => {
    const { id_producto, id_promocion } = req.query
    const filteredData = await this.productoPromocionModel.getAll({
      id_producto,
      id_promocion
    })

    if (!filteredData)
      return res
        .status(404)
        .json({ message: 'Producto-promocion no encontrado' })

    res.status(200).json(filteredData)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const result = await this.productoPromocionModel.getById({
      id
    })

    if (result) return res.status(200).json(result)
    return res.status(404).json({ message: 'Producto-promocion no encontrado' })
  }

  create = async (req, res) => {
    const result = req.body

    try {
      const newData = await this.productoPromocionModel.create({
        input: result
      })

      return res.status(201).json(newData)
    } catch (error) {
      if (error === 'producto-promocion existe') {
        return res
          .status(409)
          .json({ message: 'Promocion ya registrada con el producto' })
      }
      return res.status(500).json({ error: 'Error creando ProductoPromocion' })
    }
  }

  update = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })
    const result = req.body

    try {
      const updatedData = await this.productoPromocionModel.update({
        id,
        input: result
      })

      if (updatedData === false)
        return res
          .status(404)
          .json({ message: 'Producto-promocion no encontrado' })

      return res.status(200).json(updatedData)
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Data format incorrect' })
      }
      return res
        .status(500)
        .json({ error: 'Error actualizando Producto-promocion' })
    }
  }

  delete = async (req, res) => {
    const { id_producto, id_promocion } = req.params

    try {
      const deletedData = await this.productoPromocionModel.delete({
        id_producto,
        id_promocion
      })

      if (deletedData === false)
        return res
          .status(404)
          .json({ message: 'Producto-promocion no encontrado' })

      return res.status(200).json(deletedData)
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Error deleting Producto-promocion' })
    }
  }
}
