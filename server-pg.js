import { createApp } from "./app.js";
import { InsumoModel } from "./models/postgre/insumo.js";
import { PersonalModel } from "./models/postgre/personal.js";
import { ProductoInsumoModel } from "./models/postgre/producto-insumo.js";
import { ProductoPromocionModel } from "./models/postgre/producto-promocion.js";
import { ProductoModel } from "./models/postgre/producto.js";
import { UsuarioModel } from "./models/postgre/usuario.js";

createApp({
  usuarioModel: UsuarioModel,
  personalModel: PersonalModel,
  insumoModel: InsumoModel,
  productoModel: ProductoModel,
  productoInsumoModel: ProductoInsumoModel,
  productoPromocionModel: ProductoPromocionModel,
});
