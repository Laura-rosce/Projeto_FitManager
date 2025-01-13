import { registrarPagamento, getAllPagamentos, contarReceitasMensais, limparTabela, buscarPendencias } from '../repositorys/receita.repository.js';
import {getAlunoByCpfEstatico } from '../repositorys/aluno.repository.js'

//Registra um pagamento e insere na tabela de receitas.
export const registrarPagamentoController = async (req, res) => {
  const { cpf, valor } = req.body;

  try {

    const aluno = await getAlunoByCpfEstatico(cpf);

    if (!aluno){
      return res.status(404).json({error: "Esse CPF não está cadastrado!"});
    }

    // Calcula o vencimento da fatura (1 mês após o registro)
    const vencimentoFatura = new Date();
    vencimentoFatura.setMonth(vencimentoFatura.getUTCMonth() + 1);

    // Registra o pagamento
    const pagamentoRegistrado = await registrarPagamento(cpf, valor, vencimentoFatura);

    return res.status(200).json({ message: 'Pagamento registrado com sucesso.', pagamento: pagamentoRegistrado });
  } catch (error) {
    console.error("Erro no controller de pagamento:", error);
    const message = error.message || "Erro interno no servidor.";
    return res.status(error.status || 500).json({ error: message });
  }
};

// Obtém todos os pagamentos registrados.
export const exibePagamentosController = async (req, res) => {
  try {
    const pagamentos = await getAllPagamentos();
    return res.status(200).json(pagamentos);
  } catch (error) {
    console.error('Erro ao obter pagamentos:', error);
    return res.status(500).json({ error: 'Erro ao obter pagamentos.' });
  }
};

// Obtém as receitas mensais para o dashboard. 
export const obterReceitasMensaisController = async (req, res) => {
  const { ano } = req.query; // Recebe o ano como parâmetro opcional
  const anoAtual = ano ? parseInt(ano, 10) : new Date().getFullYear(); // se ano estiver definido -> usa o ano repassado como inteiro, se não ele captura o ano atual

  try {
    const receitas = await contarReceitasMensais(anoAtual);
    const receitasMensais = {};

    for (let i = 0; i < receitas.length; i++) {
      const receita = receitas[i];
  
      // Obtém o mês do pagamento (1 a 12)
      const mes = new Date(receita.dataPagamento).getUTCMonth() + 1;
  
      // Se o mês ainda não existe no objeto, inicializa com 0
      if (!receitasMensais[mes]) {
          receitasMensais[mes] = 0;
      }
      
      // Soma o valor da receita ao total acumulado do mês
      receitasMensais[mes] += parseFloat(receita.valor);
    }
    
    return res.status(200).json(receitasMensais);
  } catch (error) {
    console.error('Erro ao obter receitas mensais:', error);
    return res.status(500).json({ error: 'Erro ao obter receitas mensais.' });
  }
};

// Obtém a receita anual para o dashboard:
export const obterReceitaAnualController = async (req, res) => {
  const { ano } = req.query;
  const anoAtual = ano ? parseInt(ano, 10) : new Date().getFullYear();

  try{
    const receitas = await contarReceitasMensais(anoAtual);

    const receitaAnual = receitas.reduce ((total, receita) => {
      return total + parseFloat(receita.valor);
    }, 0);

    return res.status(200).json({receitaAnual});

  }catch (error){
    console.error('Erro ao obter receita anual: ', error);
    return res.status(500).json({error: 'Error ao obter receita anual.'})
  }
};

// Limpa a tabela de Receita 
export const limpaTabelaReceitaController = async (req, res, next) => {
  try {
    limparTabela();
    res.status(200).json({ message: 'Dados da tabela de receita apagados.' });
  } catch (error) {
    console.error('Erro ao limpar dados da tabela de receita:', error);
    res.status(500).json({ message: 'Erro ao tentar limpar os dados.' });
  }
};

/* PARA A PARTE DO PENDÊNCIAS */ 

//Busca as pendencias atraves da tabela de aluno
export const buscarPendenciasController = async (req, res) => {
  try {
    // Chama o repository para buscar as pendências
    const pendencias = await buscarPendencias();

    if (!pendencias) {
      return res.status(404).json({ message: 'Nenhuma pendência encontrada.' });
    }

    // Retorna as pendências encontradas
    return res.status(200).json(pendencias);
  } catch (error) {
    console.error('Erro ao buscar pendências:', error);
    return res.status(500).json({ error: 'Erro ao buscar pendências. Tente novamente.' });
  }
};