/* INTEGRAÇÃO DA API COM A ÁREA DE REGISTRAR FREQUÊNCIA DE ENTRADA E SAÍDA */

// Função Assícrona para adicionar o aluno na frequência


// Função Assícrona  para remover o aluno na frequência
async function sairFrequencia() {
  const usuarioInput = document.getElementById("user").value.trim();
  const senhaInput = document.getElementById("senha").value.trim();

  // Verifica se os campos não estão vazios
  if (!usuarioInput || !senhaInput) {
    return alert('Por favor, preencha ambos os campos de usuário e senha.');
  }

  try {
    const response = await fetch(`${url}/frequencia/sair`, {  // Chama a API para remover da frequência
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioAluno: usuarioInput, senhaAluno: senhaInput })  // Envia o nome de usuário
    });
    const data = await response.json();

    // Verifica se a requisição foi bem-sucedida
    if (response.ok) {
      alert(`${usuarioInput} desconectado da frequência.`);

      // Remove o botão correspondente do usuário na barra lateral
      const barraLateral = document.querySelector(".sidebar");

      // Identificador do botão é criado dinamicamente com base no usuarioInput
      const botaoUsuario = document.querySelector(`#botao-${usuarioInput}`);
      
      // Garante que o botão existe antes de tentar removê-lo
      if (botaoUsuario){
        botaoUsuario.remove();
        document.getElementById('user').value = "";
        document.getElementById('senha').value = "";
      } 
    } else {
      alert (data.message);
    }
  } catch (error) {
    console.error('Erro ao desconectar da frequência:', error);
    alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
  }
  
}

// Função para limpar dados da tabela e evitar conflitos de login na atualização da página.
function limparTabelaFrequencia() {
  fetch(`${url}/frequencia/limpa`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        console.log('Dados da tabela de frequência apagados com sucesso!');
      } else {
        console.error('Erro ao limpar os dados da tabela de frequência.');
      }
    })
    .catch(error => {
      console.error('Erro ao tentar limpar os dados da tabela de frequência:', error);
    });
}

// Função para colocar eventos nos botões de entrada e saída
function atribuirEventos() {
  // Adiciona o evento ao botão "Entrar
  document.querySelector("#entrarBtn").addEventListener("click", function (event) {
    event.preventDefault();  // Evita o envio do formulário
    entrarFrequencia();  // Chama a função para registrar o aluno na frequência
  });
  // Adiciona o evento ao botão "Sair"
  document.querySelector("#sairBtn").addEventListener("click", function (event) {
    event.preventDefault();  // Evita o envio do formulário
    sairFrequencia();  // Chama a função para remover o aluno da frequência
  });
}

// Lógica de exibir a senha (olhinho) 
document.getElementById('toggleSenha').addEventListener('click', function () {
  const inputSenha = document.getElementById('senha');
  const iconeOlho = document.getElementById('iconeOlho');

  const isPassword = inputSenha.type === 'password';
  inputSenha.type = isPassword ? 'text' : 'password';
  iconeOlho.className = isPassword ? 'bi bi-eye' : 'bi bi-eye-slash';
});

// main
// Verifica se a página foi recarregada ou carregada pela primeira vez
if (!sessionStorage.getItem('pageReloaded')) {
  // Marca que a página foi carregada pela primeira vez
  sessionStorage.setItem('pageReloaded', 'true');
} else {
  // Se a página foi recarregada, limpa os dados da tabela
  limparTabelaFrequencia();
}

atribuirEventos();
