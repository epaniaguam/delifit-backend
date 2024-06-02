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
  usuarioModel: UsuarioModel,
  personalModel: PersonalModel,
  insumoModel: InsumoModel,
  productoModel: ProductoModel,
  productoInsumoModel: ProductoInsumoModel,
  productoPromocionModel: ProductoPromocionModel,
  promocionModel: PromocionModel,
  listaProductoModel: ListaProductoModel,
  listaPromocionModel: ListaPromocionModel,
  pedidoModel: PedidoModel,
  facturaModel: FacturaModel,
});
