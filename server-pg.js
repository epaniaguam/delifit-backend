import { createApp } from "./app.js";
import { PersonalModel } from "./models/postgre/personal.js";
import { UsuarioModel } from "./models/postgre/usuario.js";

createApp({
  usuarioModel: UsuarioModel,
  personalModel: PersonalModel,
});
