import {createAluno, getAllAlunos, getAlunoByCpfDinamico, getAlunoByCpfEstatico, updateAluno, deleteAluno, deleteAllAluno, contaAlunos } from "../repositorys/aluno.repository.js";
import {atualizarStatusPagamentos, registrarPagamento} from '../repositorys/receita.repository.js'
import bcrypt from 'bcrypt';

//Cria Aluno
export const createAlunoController = async (req, res) => {
    function formatarNome(nomeAluno) {
        const nomeArray = nomeAluno.split(" ");
        return nomeArray
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
            .join(' ');
    }

  try {
    // Extração dos dados do corpo da requisição
    const {usuarioAluno, senhaAluno, nomeAluno, emailAluno, telefoneAluno, idade, cpfAluno, statusPagamento, vencimentoFatura} = req.body;

    // Criptografar a senha antes de salvar no banco
    const senhaHash = await bcrypt.hash(senhaAluno, 10);  // 10 é o número de salt rounds

    // Converter vencimentoFatura para o formato ISO 8601
    const vencimentoFaturaDate = new Date(vencimentoFatura);
    const vencimentoFaturaISO = vencimentoFaturaDate.toISOString();


    //Formatação do numero de telefone para garantir que não haverá erros, por ser um campo opcional
    const telefoneFormatado = telefoneAluno && telefoneAluno.trim() !== "" ? telefoneAluno : null;

    // Agora criamos o aluno com a senha criptografada
    const alunoCriado = await createAluno({
      usuarioAluno,
      senhaAluno: senhaHash, 
      nomeAluno: formatarNome(nomeAluno),
      emailAluno,
      telefoneAluno: telefoneFormatado,
      idade,
      cpfAluno,
      statusPagamento,
      vencimentoFatura: vencimentoFaturaISO,    
    });

    res.status(201).send(alunoCriado);
  } catch (e) {
    console.error(e); 
    res.status(400).send({ message: 'O CPF cadastrado já existe!', error: e.message });
  }
};

// Obter todos os Alunos
export const getAllAlunosController = async (req, res) => {
    try {
      const alunos = await getAllAlunos(); 
      return res.status(200).json(alunos); 
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar alunos" });
    }
};

//Obter quantidade de alunos cadastrados
export const contaAlunosController = async (req, res) => {
  try{
    const quantidadeAlunos = await contaAlunos();
    return res.status(200).json({quantidadeAlunos});
  }catch (error){
    console.error ('Erro ao contar alunos:', error);
    return res.status(500).json({ error: 'Erro ao contar alunos.' });
  }
  
};

// Deletar Aluno
export const deleteAlunoController = async (req, res) => {
  const cpfAluno = req.params.cpfAluno;
  try{
    await deleteAluno(cpfAluno);
    return res.status(200).json({message: 'Aluno removido com sucesso!'})
  } catch (error){
    res.status(500).json({error: 'Erro ao deletar recepcionista'})
  }
}

//Obter aluno pelo CPF parcial (busca de alunos)
export const getAlunoByCpfDinamicoController = async (req, res) => {
  const { cpfAluno } = req.params;
  try {
      const aluno = await getAlunoByCpfDinamico(cpfAluno);
      if (!aluno) {
          return res.status(404).json({message: 'Nenhum aluno encontrado com esse CPF!' });
      }
      res.status(200).json(aluno);
  } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

//Obter aluno pelo CPF completo (dados)
export const getAlunoByCpfEstaticoController = async (req, res) => {
  const { cpfAluno } = req.params;

  try {
      // Usando a função do repositório para buscar o recepcionista
      const aluno = await getAlunoByCpfEstatico(cpfAluno);
      res.status(200).json(aluno);
  } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

//Atualizar Aluno
export const updateAlunoController = async (req, res) => {
  const { cpfAluno } = req.params; // Obtém o cpf do aluno via parâmetro na URL
  const { nomeAluno, emailAluno, telefoneAluno, vencimentoFatura} = req.body; // Obtém os dados do aluno do corpo da requisição

  try {

      // Converter vencimentoFatura para o formato ISO 8601
      const vencimentoFaturaDate = new Date(vencimentoFatura);
      const vencimentoFaturaISO = vencimentoFaturaDate.toISOString();

      // Criando o objeto de dados a serem atualizados
      const dadosAtualizados = {
          nomeAluno,
          emailAluno,
          telefoneAluno,
          vencimentoFatura: vencimentoFaturaISO,
      };

      // Chama o repositório para atualizar os dados do aluno
      const alunoAtualizado = await updateAluno(cpfAluno, dadosAtualizados);
     

      if (dadosAtualizados.vencimentoFatura) {
        const atualiza = await atualizarStatusPagamentos();
        // Retorna os dados atualizados
        return res.status(200).json({
            message: 'Dados do aluno atualizados com sucesso',
            aluno: alunoAtualizado,
            atualiza: atualiza
        });
      }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar todos os Alunos (para limpar tabela)
export const deleteAllAlunoController = async (req, res) => {
  try{
    await deleteAllAluno();
    return res.status(200).json({message: 'Aluno removido com sucesso!'})
  } catch (error){
    res.status(500).json({error: 'Erro ao deletar recepcionista'})
  }
}


