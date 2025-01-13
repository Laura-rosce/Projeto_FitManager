import { prisma } from "../services/prisma.js"

// Cria Aluno
export const createAluno = async (data) => {
    const aluno = await prisma.aluno.create({
        data,
    }); 
    
    return aluno;
};

// Exibe Aluno
export const getAllAlunos = async () => {
    const aluno = await prisma.aluno.findMany();
    return aluno;
};

// Contador de Alunos
export const contaAlunos = async () => {
    const totalAlunos = await prisma.aluno.count()
    return totalAlunos;
};
// Obter alunos por CPF parcial
export const getAlunoByCpfDinamico = async (cpfAluno) => {
    return await prisma.aluno.findMany({
        where: {
            cpfAluno: {
                contains: cpfAluno,  // Permite buscar por CPF parcial
                mode: 'insensitive', // Ignora maiúsculas e minúsculas
            },
        },
    }); 
};

// Obter alunos por CPF total
export const getAlunoByCpfEstatico = async (cpfAluno) => {
    return await prisma.aluno.findUnique({
        where: {
            cpfAluno: cpfAluno,  // Buscar exatamente pelo CPF
        },
    });
};

// Atualização dos dados de aluno
export const updateAluno = async (cpfAluno, dados) => {
    const aluno = await prisma.aluno.update({
        where: { cpfAluno }, data:dados,
    });
    return aluno;
};

// Remoção do aluno
export const deleteAluno = async (cpfAluno) => {
    await prisma.aluno.delete({
        where: { cpfAluno },
    });
    return;
};

// Usado para fins de comparação no controller de frequência
export const getAlunoByUsuario = async (usuarioAluno) => {
    return prisma.aluno.findFirst({
      where: {usuarioAluno: usuarioAluno}
    });
};

// Limpa tabela de alunos
export const deleteAllAluno = async () =>{
    return prisma.aluno.deleteMany({});
};