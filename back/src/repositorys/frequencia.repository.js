import { prisma } from "../services/prisma.js";

// Busca as frequencias
export const buscarFrequenciaPorAluno = async (cpfAluno) => {
  return prisma.frequencia.findFirst({
    where: { idAluno: cpfAluno},
    orderBy: { data: 'desc' }, // buscar a última frequência registrada
  });
};

//Cria a frequencia 
export const criarFrequencia = async (cpfAluno) => {
  return prisma.frequencia.create({
    data: {
      idAluno: cpfAluno,
      tempo: 0, 
      data: new Date(),
      status: true
    },
  });
};

//Remove a frequencia 
export const deletarFrequencia = async (idFreq) => {
  return prisma.frequencia.delete({
    where: { idFreq: idFreq },
  });
};

//Verifica se a frequencia está ativa
export const verificaFrequenciaAtiva = async (cpf) => {
  // Consulta no Prisma para verificar se existe uma frequência ativa para o aluno
  return prisma.frequencia.findFirst({
    where: {
      idAluno: cpf,
      status: true // Certifica-se de que apenas frequências ativas são retornadas 
    },
  });
};

// Limpa tabela de frequencia
export const limparTabela = async () => {
  return prisma.frequencia.deleteMany({});
};