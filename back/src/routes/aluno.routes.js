import { createAlunoController, getAllAlunosController, getAlunoByCpfDinamicoController, getAlunoByCpfEstaticoController, updateAlunoController, deleteAlunoController, deleteAllAlunoController, contaAlunosController} from "../controllers/aluno.controller.js";

const alunoRoutes = (app) => {
  app.post("/aluno/criar", createAlunoController);
  app.get("/aluno/mostra", getAllAlunosController);
  app.get("/aluno/busca/:cpfAluno", getAlunoByCpfDinamicoController);
  app.get("/aluno/exibir/:cpfAluno", getAlunoByCpfEstaticoController);
  app.put("/aluno/editar/:cpfAluno", updateAlunoController);
  app.delete("/aluno/remover/:cpfAluno", deleteAlunoController);
  app.get ("/aluno/contador/", contaAlunosController);
  app.delete ("/aluno/removertudo", deleteAllAlunoController) // limpa as tabelas
};

export default alunoRoutes;
