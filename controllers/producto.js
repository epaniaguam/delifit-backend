export class ProductoController {
  constructor({ productoModel }) {
    this.productoModel = productoModel
  }

  getAll = async (req, res) => {
    const { precio, categoria, visibilidad } = req.query

    if (visibilidad !== undefined) {
      if (visibilidad !== 'true' && visibilidad !== 'false') {
        return res.status(400).json({ message: 'visibilidad debe ser bool' })
      }
    }

    if (precio) {
      const validPrecio = Number(precio)
      if (Number.isNaN(validPrecio)) {
        return res.status(400).json({ message: 'Precio is not a number' })
      }
    }

    const filteredData = await this.productoModel.getAll({
      precio,
      categoria,
      visibilidad
    })
    // console.log("filteredData:", filteredData);

    if (!filteredData)
      return res.status(404).json({ message: 'No producto found' })

    res.status(200).json(filteredData)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const result = await this.productoModel.getById({ id })
    // console.log("result:", result);
    if (result) return res.status(200).json(result)
    return res.status(404).json({ message: 'Producto not found' })
  }

  create = async (req, res) => {
    // to do : validar datos con zod
    // const result = validateUsuario(req.body)
    const result = req.body

    try {
      const newData = await this.productoModel.create({ input: result })
      // console.log("newData:", newData);

      return res.status(201).json(newData)
    } catch (error) {
      if (error.includes('ya existe')) {
        // console.log(error);
        return res.status(409).json({ message: 'Producto ya existe' })
      }
      return res.status(500).json({ error: 'Error creando Producto' })
    }
  }

  update = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })
    const result = req.body

    try {
      const updatedData = await this.productoModel.update({
        id,
        input: result
      })
      // console.log("updatedData:", updatedData);

      if (updatedData === false)
        return res.status(404).json({ message: 'Producto not found' })

      return res.status(200).json(updatedData)
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Id format incorrect' })
      }
      return res.status(500).json({ error: 'Error actualizando Producto' })
    }
  }

  delete = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })

    try {
      const deletedData = await this.productoModel.delete({ id })
      // console.log("deletedData:", deletedData);

      if (deletedData === false)
        return res.status(404).json({ message: 'Producto not found' })

      return res.status(200).json({ message: 'Producto deleted' })
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Id format incorrect' })
      }
      return res.status(500).json({ error: 'Error eliminando Producto' })
    }
  }
}
