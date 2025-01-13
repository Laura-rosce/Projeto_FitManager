import { criarFrequenciaController, deletarFrequenciaController, limpaTabelaFrequenciaController } from '../controllers/frequencia.controller.js';

const frequenciaRoutes = (app) =>{
  app.post("/frequencia/entrar", criarFrequenciaController);
  app.delete ("/frequencia/sair", deletarFrequenciaController);
  app.delete ("/frequencia/limpa", limpaTabelaFrequenciaController);
}

export default frequenciaRoutes;









