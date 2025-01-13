import alunoRoutes from "./aluno.routes.js";
import frequenciaRoutes from "./frequencia.routes.js";
import receitaRoutes from "./receita.router.js";
import recepcionistaRoutes from "./recepcionista.routes.js";
import adminRouter from './admin.router.js'


const routes = (app) => {
  alunoRoutes(app);
  frequenciaRoutes(app);
  recepcionistaRoutes(app);
  receitaRoutes(app);
  adminRouter(app);
};


export default routes;
