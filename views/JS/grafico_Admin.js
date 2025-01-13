/*INTEGRAÇÃO DA API PARA RENDERIZAR O GRÁFICO DE RECEITA E TOTAL ALUNOS NO FRONTEND */

// Preenche o valor da Receita anual
async function ReceitaAnual() {
  try {
    const anoSelecionado = document.getElementById('ano').value;

    const response = await fetch(`${url}/receita/anual?ano=${anoSelecionado}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar receita anual: ${response.status}`);
    }

    const data = await response.json();

    // Atualiza o botão com o valor da receita
    const receitaButton = document.getElementById('botaoReceita');
    receitaButton.textContent = `Receita: R$ ${data.receitaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  } catch (error) {
    console.error(error.message);
  }
};

// Faz requisição para buscar o total de alunos 👍
async function TotalAlunos () {
  try {
    const response = await fetch(`${url}/aluno/contador/`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar o total de alunos: ${response.status}`);
    }

    const data = await response.json();

    // Atualiza o botão com o valor da receita
    const alunoButton = document.getElementById('botaoTotalAlunos');
    alunoButton.textContent = `Total de Alunos: ${data.quantidadeAlunos}`;
  } catch (error) {
    console.error(error.message);
  }
}

// Função para buscar receitas mensais do backend
async function obterReceitasMensais(ano) {
  try {
    const response = await fetch(`${url}/receita/mensal?ano=${ano}`);

    // Verifica o status da resposta
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const receitas = await response.json();

    // Cria um array de 12 posições, inicialmente preenchido com 0
    const receitasMensais = Array(12).fill(0);

    // Preenche o array com os valores correspondentes aos meses retornados
    Object.entries(receitas).forEach(([mes, valor]) => {
      const mesIndex = parseInt(mes, 10) - 1;
      if (mesIndex >= 0 && mesIndex < 12) {
        receitasMensais[mesIndex] = valor; // Atribui o valor da receita ao mês correspondente
      }
    });

    return receitasMensais;
  } catch (error) {
    console.error(`Erro ao buscar receitas mensais: ${error.message}`);
  }
}

// Função para renderizar o gráfico de acordo com os dados do obterReceitasMensais(ano)
async function renderizarGrafico() {
  const ctx = document.getElementById('myBarChart').getContext('2d');
  const anoSelecionado = document.getElementById('ano').value;
  const receitas = await obterReceitasMensais(anoSelecionado);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const data = {
    labels: meses,
    datasets: [
      {
        label: ' ',
        data: receitas,
        borderColor: 'rgba(32, 60, 70, 0.76)', // Cor da linha
        backgroundColor: 'rgba(255, 99, 132, 0)', // Cor de fundo da linha (transparente)
        borderWidth: 2,
        fill: false, // A linha não vai preencher abaixo dela
        tension: 0.0, // Suaviza a linha
        type: 'line', // Tipo de gráfico para a linha
      },
      {
      label: `Receitas (${anoSelecionado})`,
      data: receitas,
      backgroundColor: 'rgba(252, 254, 255, 0.99)',
      borderColor: '#0f9b9f',
      borderWidth: 2,
      }
  ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'black', // Cor da legenda
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'white', // Cor dos números no eixo X
          }
        },
        y: {
          ticks: {
            color: 'white', // Cor dos números no eixo Y
          }
        }
      }
    }
  }

  // Destruir gráfico anterior, se existir
  if (window.myBarChart instanceof Chart) {
    window.myBarChart.destroy();
  }

  // Criar novo gráfico
  window.myBarChart = new Chart(ctx, config);
}

// Preenche os anos dinamicamente no seletor
function preencherAnos() {
  const anoAtual = new Date().getFullYear(); // ano atual
  const seletorAno = document.getElementById('ano'); // seleciona o elemento <select> no dom

  for (let ano = anoAtual; ano <= anoAtual + 5; ano++) {
    const opcao = document.createElement('option'); // criar um elemento <option>
    opcao.value = ano; // Define o valor da opção como o ano
    opcao.textContent = ano; // Define o texto visível como o ano
    seletorAno.appendChild(opcao); //adiciona dentro da tag de <select>
  }
}

// Função para lidar com a mudança do ano no seletor
function onAnoChange() {
  renderizarGrafico();
  ReceitaAnual();
  TotalAlunos();
}

// Preenche os anos no seletor
preencherAnos();
document.getElementById('ano').value = new Date().getFullYear();

// Atribui o evento para o seletor de ano
document.getElementById('ano').addEventListener('change', onAnoChange);

// Chama a função de inicialização para o ano atual
document.addEventListener('DOMContentLoaded', () => {
  ReceitaAnual();
  TotalAlunos();
  renderizarGrafico();
});
