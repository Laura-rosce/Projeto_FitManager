/* INTEGRAÇÃO DA API COM A DE RECEITA COM O FRONTEND */

// Utiliza na parte de visualizar as pendências na tela:
let blocosVisiveis = 6; // Quantidade inicial de blocos visíveis
let todasPendencias = []; // Armazena todas as pendências carregadas

// Função que faz requisição para registra pagamento
async function registraPagamento(event) {
  event.preventDefault();

  const cpf = document.getElementById('cpf').value;
  const valor = document.getElementById('receita').value;

  if (!cpf || !valor) {
    alert("Preencha todos os campos.");
    return;
  }

  // Envia os dados para o backend (sem a data, pois o backend vai calcular)
  const response = await fetch(`${url}/receita/registrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cpf, valor })
  });

  const data = await response.json();
  if (response.ok) {
    alert(data.message); // Exibe a mensagem de sucesso
  } else {
    alert(data.error);
  }
} 

// Função que faz requisição para buscar pendências da rota e inicializar a renderização
async function buscarPendencias() {
  try {
    const response = await fetch(`${url}/pendencias`);
    const pendencias = await response.json();
    todasPendencias = pendencias; // Armazena todas as pendências

    renderizarBlocosPendencias(); // Renderiza os primeiros blocos
  } catch (error) {
    console.error(`Erro ao buscar as pendências: ${error.message}`);
  }
}

// Função para renderizar os blocos visíveis
function renderizarBlocosPendencias() {
  const container = document.getElementById("containerPendencias");
  container.innerHTML = ""; // Limpa o container antes de renderizar

  if (todasPendencias.length === 0) {
  // Se não houver pendências, renderiza uma mensagem
    const aviso = document.createElement("div");
    aviso.classList.add("alert", "alert-danger", "text-center", "rounded", "mb-3");
    aviso.textContent = "Não há pendências no momento.";
    container.appendChild(aviso);
  } else {
  // Renderiza apenas os blocos até o limite atual (blocosVisiveis)
    todasPendencias.slice(0, blocosVisiveis).forEach((pendencia, index) => {
      const card = document.createElement("div");
      card.classList.add("card_view");
      card.id = `pendencia_${index + 1}`;

      // Criando a imagem
      const img = document.createElement("img");
      img.src = "../CSS/images/dados.png";
      card.appendChild(img);

      // Criando a div infoAluno
      const infoAluno = document.createElement("div");
      infoAluno.classList.add("infoAluno");

      // Criando a div para nome e telefone juntos
      const nomeTelefoneDiv = document.createElement("div");
      nomeTelefoneDiv.classList.add("nomeTelefone");

      // Nome do aluno
      const nomeAluno = document.createElement("div");
      nomeAluno.classList.add("nomeAluno");
      nomeAluno.textContent = formatarNome(pendencia.nomeAluno);

      // Telefone do aluno
      const telefoneAluno = document.createElement("div");
      telefoneAluno.classList.add("telefoneAluno");
      telefoneAluno.textContent = pendencia.telefoneAluno;

      // Adicionando o nome e o telefone dentro da mesma div
      nomeTelefoneDiv.appendChild(nomeAluno);
      nomeTelefoneDiv.appendChild(telefoneAluno);

      // Adicionando a div que contém nome e telefone na div infoAluno
      infoAluno.appendChild(nomeTelefoneDiv);

      card.appendChild(infoAluno);

      // Criando o botão "Pendente"
      const button = document.createElement("button");
      button.textContent = "Pendente";
      card.appendChild(button);

      // Adicionando o card ao container
      container.appendChild(card);
    });
  }
}

// Função para carregar mais blocos
function carregarMaisBlocos() {
  if (blocosVisiveis < todasPendencias.length) {
    blocosVisiveis += 6; // Incrementa o número de blocos visíveis em 6
    renderizarBlocosPendencias(); // Atualiza a renderização
  } else {
    alert("Não há mais pessoas para exibir."); // Caso não haja mais blocos a exibir
  }
}

// Função para formatação
function formatarNome(nomeAluno) {
  const palavraFormatada = nomeAluno.split(" ").slice(0, 2);
  return palavraFormatada.join(" "); // Junta as palavras com espaço
}

if (window.location.pathname.endsWith("pendencias_de_pagamentos.html")){
    document.addEventListener("DOMContentLoaded", () => {
      buscarPendencias(); // Busca as pendências quando a página carregar
      const botaoVerMais = document.getElementById("botaoVerMais");
      botaoVerMais.addEventListener("click", carregarMaisBlocos);
    });
}

