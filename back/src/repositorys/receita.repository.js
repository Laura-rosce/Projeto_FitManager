import { prisma } from '../services/prisma.js';
import cron from 'node-cron';

// Registra pagamentos
export const registrarPagamento = async (cpfAluno, valor, vencimentoFatura) => {
  // Configuração para alternar entre teste e produção
  // TESTE
  const isTesting = false;
  const agora = isTesting ? new Date("2026-05-10") : new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

  // Verificar se o aluno existe
  const aluno = await prisma.aluno.findUnique({
    where: { cpfAluno },
  });

  if (!aluno) {
    throw { status: 404, message: 'Este CPF não está cadastrado!' };
  }

  // Verificar se já existe um registro na tabela receita para o mês atual
  const receitaExistente = await prisma.receita.findFirst({
    where: {
      idAluno: cpfAluno,
      dataPagamento: {
        gte: inicioMes, 
        lte: fimMes,  
      },
    },
  });

  if (receitaExistente) {
    throw { status: 400, message: 'Já existe um registro de pagamento para este aluno neste mês.' };
  }

  // Calcular novo vencimento
  const novoVencimento = new Date(aluno.vencimentoFatura);
  novoVencimento.setMonth(novoVencimento.getMonth() + 1);

  // Criar o registro de pagamento na tabela RECEITA
  const pagamento = await prisma.receita.create({
    data: {
      idAluno: aluno.cpfAluno,
      valor,
      statusPagamento: 'pago',
      dataPagamento: agora,
      vencimentoFatura: novoVencimento,
    },
  });

  // Atualizar o registro do aluno na tabela ALUNO
  await prisma.aluno.update({
    where: { cpfAluno },
    data: {
      statusPagamento: 'pago',
      vencimentoFatura: novoVencimento,
    },
  });

  return pagamento;
};

// Atualiza junto com node-cron o status do pagamento
export const atualizarStatusPagamentos = async () => {
  const alunos = await prisma.aluno.findMany();
  const receitas = await prisma.receita.findMany();
  
  // TESTE
  const isTesting = false;
  const agora = isTesting ? new Date("2025-02-13") : new Date();

  for (const aluno of alunos) {
    const receitaAtual = receitas.find(r => {
      const dataPagamento = new Date(r.dataPagamento);
      return r.idAluno === aluno.cpfAluno &&
        dataPagamento.getFullYear() === agora.getFullYear() &&
        dataPagamento.getMonth() === agora.getMonth(); // Mês atual
    });

    let novoStatus;

    if (receitaAtual) {
      // Caso exista receita no mês atual
      if (aluno.vencimentoFatura >= agora) {
        novoStatus = 'pago';
      } else {
        novoStatus = 'pendente';
      }
    } else {
      // Caso não exista receita no mês atual
      if (aluno.vencimentoFatura >= agora) {
        novoStatus = 'pago';
      } else  if (aluno.vencimentoFatura < agora) {
        novoStatus = 'pendente';
      }
    }

    // Atualizar somente o status do aluno se houver mudança
    if (novoStatus !== aluno.statusPagamento) {
      await prisma.aluno.update({
        where: { cpfAluno: aluno.cpfAluno },
        data: { statusPagamento: novoStatus },
      });
    }
  }

  return { message: 'Status de pagamentos atualizado com sucesso.' };
};

// Executar a cada 1 minuto para atualizar o Status Pagamento
cron.schedule('* * * * *', async () => {
  try {
      const resultado = await atualizarStatusPagamentos();
      //console.log(resultado.message);
      return resultado;
    } catch (error) {
      console.error('Erro ao atualizar status de pagamentos:', error.message);
    }
});

// Obtém as receitas mensais para o dashboard.
export const contarReceitasMensais = async (anoAtual) => {
    const receitas = await prisma.receita.findMany({
      where: {
        dataPagamento: {
          gte: new Date(`${anoAtual}-01-01`), 
          lt: new Date(`${anoAtual + 1}-01-01`), 
        },
        statusPagamento: 'pago', // Filtra somente receitas com status 'pago'
      },
    });

    return receitas;
};

/* PARA A PARTE DO PENDÊNCIAS */

// Filtra as pendencias
export const buscarPendencias = async () => {
    const pendencias = await prisma.aluno.findMany({
      where: {
        statusPagamento: 'pendente',  // Filtrando apenas pendências
      },
      select: { nomeAluno: true, telefoneAluno: true },
    });

    return pendencias;
};

// Obtém todas as receitas registradas. -> TESTE
export const getAllPagamentos = async () => {
  return await prisma.receita.findMany();
};

//Limpar tabela -> TESTE
export const limparTabela = async () => {
  return prisma.receita.deleteMany({});
};





