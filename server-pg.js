import { createApp } from "./app.js";

import { FacturaModel } from "./models/postgre/factura.js";
import { InsumoModel } from "./models/postgre/insumo.js";
import { ListaProductoModel } from "./models/postgre/lista-producto.js";
import { ListaPromocionModel } from "./models/postgre/lista-promocion.js";
import { PedidoModel } from "./models/postgre/pedido.js";
import { PersonalModel } from "./models/postgre/personal.js";
import { ProductoInsumoModel } from "./models/postgre/producto-insumo.js";
import { ProductoPromocionModel } from "./models/postgre/producto-promocion.js";
import { ProductoModel } from "./models/postgre/producto.js";
import { PromocionModel } from "./models/postgre/promocion.js";
import { UsuarioModel } from "./models/postgre/usuario.js";

createApp({
  facturaModel: FacturaModel,
  insumoModel: InsumoModel,
  listaProductoModel: ListaProductoModel,
  listaPromocionModel: ListaPromocionModel,
  pedidoModel: PedidoModel,
  personalModel: PersonalModel,
  productoInsumoModel: ProductoInsumoModel,
  productoPromocionModel: ProductoPromocionModel,
  productoModel: ProductoModel,
  promocionModel: PromocionModel,
  usuarioModel: UsuarioModel,
});
