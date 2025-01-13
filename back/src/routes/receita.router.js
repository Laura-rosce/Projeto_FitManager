import { registrarPagamentoController, exibePagamentosController, obterReceitasMensaisController, obterReceitaAnualController, limpaTabelaReceitaController, buscarPendenciasController} from '../controllers/receita.controller.js';

const receitaRoutes = (app) => {
  app.post('/receita/registrar', registrarPagamentoController);
  app.get('/receita/mostra', exibePagamentosController); // teste
  app.get('/receita/mensal/', obterReceitasMensaisController); // gera cada coluna do dashboard
  app.get('/receita/anual/', obterReceitaAnualController); // obter o valor gerado anualmente
  app.delete ("/receita/limpa", limpaTabelaReceitaController); //teste
  app.get('/pendencias', buscarPendenciasController);
};

export default receitaRoutes;
