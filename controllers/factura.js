export class FacturaController {
  constructor({ facturaModel }) {
    this.facturaModel = facturaModel
  }

  getAll = async (req, res) => {
    const { fecha } = req.query
    const filteredData = await this.facturaModel.getAll({ fecha })

    if (!filteredData)
      return res.status(404).json({ message: 'Factura no encontrada' })

    res.status(200).json(filteredData)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const result = await this.facturaModel.getById({
      id
    })

    if (result) return res.status(200).json(result)
    return res.status(404).json({ message: 'Factura no encontrada' })
  }

  create = async (req, res) => {
    const result = req.body

    try {
      const newData = await this.facturaModel.create({
        input: result
      })

      return res.status(201).json(newData)
    } catch (error) {
      if (error.message.includes('El registro ya existe')) {
        return res.status(409).json({ message: 'Factura ya generada' })
      }
      return res.status(500).json({ error: 'Error creando Factura' })
    }
  }

  update = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Id is required' })
    const result = req.body

    try {
      const updatedData = await this.facturaModel.update({
        id,
        input: result
      })

      if (updatedData === false)
        return res.status(404).json({ message: 'Factura no encontrada' })

      return res.status(200).json(updatedData)
    } catch (error) {
      if (error.severity) {
        return res.status(400).json({ message: 'Data format incorrect' })
      }
      return res.status(500).json({ error: 'Error actualizando Factura' })
    }
  }

  delete = async (req, res) => {
    const { id } = req.params

    try {
      const deletedData = await this.facturaModel.delete({ id })

      if (deletedData === false)
        return res.status(404).json({ message: 'Factura no encontrada' })

      return res.status(200).json(deletedData)
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting Factura' })
    }
  }
}
