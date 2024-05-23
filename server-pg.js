import { createApp } from "./app.js";
import { ProveedorModel as UsuarioModel } from "./models/postgre/usuario.js";

createApp({ usuarioModel: UsuarioModel });
