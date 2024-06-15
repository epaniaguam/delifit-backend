export class CategoriaController {
  constructor({ categoriaModel }) {
    this.categoriaModel = categoriaModel
  }

  getAll = async (req, res) => {
    const { id_categoria, descripcion_categoria, tipo, visibilidad } = req.query

    if (visibilidad !== undefined) {
      if (visibilidad !== 'true' && visibilidad !== 'false') {
        return res.status(400).json({ message: 'visibilidad debe ser bool' })
      }
    }

    const filteredData = await this.categoriaModel.getAll({
      id_categoria,
      descripcion_categoria,
      tipo,
      visibilidad
    })

    if (!filteredData)
      return res.status(404).json({ message: 'Categoria No encontrada' })

    res.status(200).json(filteredData)
  }

  getById = async (req, res) => {
    const { id } = req.params

    const result = await this.categoriaModel.getById({ id })

    if (result) return res.status(200).json(result)
    return res.status(404).json({ message: 'Categoria no encontrada' })
  }

  create = async (req, res) => {
    const result = req.body
    try {
      const newData = await this.categoriaModel.create({ input: result })
      return res.status(201).json(newData)
    } catch (error) {
      if (error.includes('La categoria ya existe')) {
        return res.status(409).json({ message: 'Categoria ya existe' })
      }
      return res.status(500).json({ error: 'Error creando Categoria' })
    }
  }

  update = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })
    const result = req.body

    try {
      const updatedData = await this.categoriaModel.update({
        id,
        input: result
      })

      if (updatedData === false)
        return res.status(404).json({ message: 'Categoria No encontrada' })

      return res.status(200).json(updatedData)
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Id format incorrect' })
      }
      return res.status(500).json({ error: 'Error actualizando Categoria' })
    }
  }

  delete = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })

    try {
      const deletedData = await this.categoriaModel.delete({ id })
      // console.log("deletedData:", deletedData);

      if (deletedData === false)
        return res.status(404).json({ message: 'Categoria No encontrada' })

      res.status(200).json({ message: 'Categoria deleted' })
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Id format incorrect' })
      }
      return res.status(500).json({ error: 'Error deleting Categoria' })
    }
  }
}
