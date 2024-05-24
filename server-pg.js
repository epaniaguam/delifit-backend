import { createApp } from "./app.js";
import { UsuarioModel } from "./models/postgre/usuario.js";

createApp({ usuarioModel: UsuarioModel });
// createApp();
