import {createRecepcionistaController, getAllRecepcionistasController, getRecepcionistaByCpfDinamicoController, getRecepcionistaByCpfEstaticoController, deleteRecepcionistaController, autenticarRecepcionista, limpaTabelaController, buscarDadosRecepcionista} from '../controllers/recepcionista.controller.js';
import { validarEntrada, autenticarToken } from '../../middleware/auth.middleware.js';

const recepcionistaRoutes = (app) => {
  app.post("/recepcionista/criar", createRecepcionistaController);
  app.post('/recepcionista/login', validarEntrada, autenticarRecepcionista);
  app.get("/recepcionista/mostra", getAllRecepcionistasController);
  app.get("/recepcionista/busca/:cpfRecep", getRecepcionistaByCpfDinamicoController);
  app.get("/recepcionista/exibir/:cpfRecep", getRecepcionistaByCpfEstaticoController);
  app.get("/recepcionista/dados", autenticarToken, buscarDadosRecepcionista);
  app.delete("/recepcionista/remover/:cpfRecep", deleteRecepcionistaController);
  app.delete("/recepcionista/limpaTabela", limpaTabelaController);
};

export default recepcionistaRoutes;