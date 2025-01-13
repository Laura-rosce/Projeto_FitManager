import { getAlunoByUsuario } from '../repositorys/aluno.repository.js';  
import { criarFrequencia, buscarFrequenciaPorAluno, deletarFrequencia, verificaFrequenciaAtiva, limparTabela } from '../repositorys/frequencia.repository.js';
import bcrypt from 'bcrypt';

//Criar registro de Frequencia
export const criarFrequenciaController = async (req, res, next) => {
  try {
    const { usuarioAluno, senhaAluno } = req.body;

    // Busca o aluno pelo usuário
    const aluno = await getAlunoByUsuario(usuarioAluno);

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não está cadastrado." });
    }

    // Verifica se a senha é válida
    const senhaValida = await bcrypt.compare(senhaAluno, aluno.senhaAluno);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    // Buscar a última frequência do aluno
    const frequencia = await verificaFrequenciaAtiva(aluno.cpfAluno);

    if (frequencia) {
      return res.status(404).json({ message: "Aluno já está ativado."});
    }

    // Caso não tenha frequência ativa, cria uma nova
    await criarFrequencia(aluno.cpfAluno);

    res.status(200).json({ message: `Frequência registrada para o aluno: ${aluno.nomeAluno}`, nomeAluno: aluno.nomeAluno}, );

  } catch (error) {
    next(error);
  }
};

//Tirar registro de Frequencia
export const deletarFrequenciaController = async (req, res, next) => {
  try {
    const { usuarioAluno, senhaAluno } = req.body;

    const aluno = await getAlunoByUsuario(usuarioAluno);

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não está cadastrado." });
    }

    // Comparar a senha fornecida com a senha armazenada (criptografada)
    const senhaValida = await bcrypt.compare(senhaAluno, aluno.senhaAluno);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    // Buscar a última frequência do aluno
    const frequencia = await buscarFrequenciaPorAluno(aluno.cpfAluno);

    if (!frequencia) {
      return res.status(404).json({ message: "Nenhuma frequência encontrada para esse aluno" });
    }

    await deletarFrequencia(frequencia.idFreq);

    res.status(200).json({ message: `${aluno.nomeAluno} desativado com sucesso.` });
  } catch (error) {
    next(error); // Passando o erro para o middleware de erro
  }
};

//Limpar Tabela quando a página for atualizada
export const limpaTabelaFrequenciaController = async (req, res, next) => {
  try {
    limparTabela();
    res.status(200).json({ message: 'Dados da tabela de frequência apagados.' });
  } catch (error) {
    console.error('Erro ao limpar dados da tabela de frequência:', error);
    res.status(500).json({ message: 'Erro ao tentar limpar os dados.' });
  }
};