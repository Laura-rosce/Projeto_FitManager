import { prisma } from "../services/prisma.js"

// Criar recepcionista
export const createRecepcionista = async (data) => {
    const recepcionista = await prisma.recepcionista.create({
        data,
    });
    return recepcionista;
};

// Mostra todos os Recepcionista
export const getAllRecepcionistas = async () => {
    const recepcionista = await prisma.recepcionista.findMany();
    return recepcionista;
};

// Obtem recepcionista pelo CPF parcial (barra de busca)
export const getRecepcionistaByCpfDinamico = async (cpfRecep) => {
    return await prisma.recepcionista.findMany({
        where: {
            cpfRecep: {
                contains: cpfRecep,  // Permite buscar por CPF parcial
                mode: 'insensitive', // Ignora maiúsculas e minúsculas
            },
        },
    }); 
};

// Obtem recepcionista pelo CPF total (barra de busca)
export const getRecepcionistaByCpfEstatico = async (cpfRecep) => {
    return await prisma.recepcionista.findUnique({
        where: {
            cpfRecep: cpfRecep,  // Buscar exatamente pelo CPF
        },
    });
};

// Remove o recepcionista
export const deleteRecepcionista = async (cpfRecep) => {
    await prisma.recepcionista.delete({
        where: { cpfRecep },
    });
    return;
};

//Limpar tabela -> TESTE
export const limparTabela = async () => {
    return prisma.recepcionista.deleteMany({});
};