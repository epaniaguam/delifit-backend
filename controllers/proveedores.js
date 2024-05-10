export class ProveedorController {
  constructor ({ proveedoresModel }) {
    this.proveedoresModel = proveedoresModel
  }

  getAll = async (req, res) => {
    const { idProveedor, nomProveedor, contacto } = req.query

    const filteredProveedores = await this.proveedoresModel.getAll({ idProveedor, nomProveedor, contacto })
    res.json(filteredProveedores)
  }
}
