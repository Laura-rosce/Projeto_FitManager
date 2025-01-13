/* INTEGRAÇÃO DA API COM FRONT-END DA ARÉA DO RECEPCIONISTA (CRUD ALUNO) */

let chavedepagina = 0;
let fetchResultados = []; // Array para armazenar os dados retornados da API
const cpf = sessionStorage.getItem('cpfSelecionado'); // Obtendo o CPF do sessionStorage

// Chave de controle:
if (window.location.pathname.endsWith("buscar_recep.html")) {
    chavedepagina = 0;  // Página de busca
} else if (window.location.pathname.endsWith("remove_recep.html")) {
    chavedepagina = 1;  // Página de remoção
}

// Função para renderizar os dados do recepcionista na área dele
async function buscarDadosRecepcionista() {
    try {

        // Obter o token armazenado no localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Você precisa fazer login para acessar esta página.');
            window.location.href = '../inicio/inicio.html';
            return;
        }

        // Fazer a requisição para o backend
        const response = await fetch(`${url}/recepcionista/dados`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Verificar se a resposta está ok
        if (response.ok) {
            const dados = await response.json();
            const recep = Array.isArray(dados) ? dados[0] : dados; // Se não for um array, transforma em um array com um único elemento

            // Agora, a renderização no frontend será feita corretamente
            const nomeEl = document.getElementById("nomeAREARECEP");
            const cpfEl = document.getElementById("cpfAREARECEP");
            const emailEl = document.getElementById("emailAREARECEP");
            const telefoneEl = document.getElementById("telefoneAREARECEP");

            if (nomeEl) nomeEl.textContent = recep.nomeRecep || "Não informado";
            if (cpfEl) cpfEl.textContent = recep.cpfRecep || "Não informado";
            if (emailEl) emailEl.textContent = recep.emailRecep || "Não informado";
            if (telefoneEl) telefoneEl.textContent = recep.telefoneRecep || "Não informado";

        } else if (response.status === 401 || response.status === 403) {
            alert('Sessão expirada! Faça login novamente!');
            window.location.href = "../inicio/login_recepcionista.html";
        } else {
            const error = await response.json();
            console.error("Erro ao buscar dados do recepcionista:", error.message || error);
            alert("Erro ao carregar os dados. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro no bloco catch da função buscarDadosRecepcionista:", error);
        alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    }
}

// Quando carrega a página renderiza os dados do recepcionista
window.onload = function() {
    buscarDadosRecepcionista();
};

/* CRUD DO SISTEMA */

// Função que cria Aluno (CREATE)
async function criarAluno(){
    const usuarioInput = document.getElementById("usuario").value.trim()
    const senhaInput = document.getElementById("senha").value.trim()
    const confirmSenhaInput = document.getElementById("confSenha").value.trim()
    const nomeInput = document.getElementById("nome").value.trim()
    const emailInput = document.getElementById("email").value.trim()
    const telefoneInput = document.getElementById("telefone").value.trim()
    const idadeInput = parseInt(document.getElementById("idade").value.trim())
    const cpfInput = document.getElementById("cpf").value.trim()
    const statusInput = document.getElementById("statusPagamento").value
    const vencimentoInput = document.getElementById("vencimentoFatura").value

    if(senhaInput !== confirmSenhaInput){
        return alert("Confira se as senhas estão iguais!");
    }

    // Remover a máscara do CPF (apenas números)
    const cpfSemMascara = cpfInput.replace(/\D/g, '');

    const res = confirm("Confirme se todos os dados estão corretos!");

    if (res) {
        try{

            const response = await fetch (`${url}/aluno/criar`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    usuarioAluno: usuarioInput, 
                    senhaAluno: senhaInput, 
                    confirmSenha: confirmSenhaInput,
                    nomeAluno: nomeInput,
                    emailAluno: emailInput,
                    telefoneAluno: telefoneInput,
                    idade: idadeInput,
                    cpfAluno: cpfSemMascara,
                    statusPagamento: statusInput,
                    vencimentoFatura: vencimentoInput
                })
            });
            
            if(response.ok){
                alert("Usuário criado com sucesso!");
                window.location.href = "area_recep.html";
            } else {
                alert('O CPF informado já está cadastrado. Cadastre outro!');
            }

        }catch(error){
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }

    } else {
        console.log('Usuário decidiu conferir os dados.');
        return; 
    }
}

// Função para exibir os dados do Aluno (READ)
async function exibirDadosAluno(cpf) {
    if (!cpf) {
        console.error('CPF não encontrado no sessionStorage.');
        return;
    }

    try {
        const response = await fetch(`${url}/aluno/exibir/${cpf}`);
        const data = await response.json();

        if (data && data.error) {
            console.log('Aluno não encontrado.');
            return;
        }
        const aluno = Array.isArray(data) ? data[0] : data;

        const nomeElem = document.getElementById('nomeAtualizado');
        const emailElem = document.getElementById('EmailAtualizado');
        const telefoneElem = document.getElementById('telefoneAtualizado');
        const dataVencimentoElem = document.getElementById('dataVencimentoAtualizado');
        
        if (nomeElem) nomeElem.value = aluno.nomeAluno;
        if (emailElem) emailElem.value = aluno.emailAluno;
        if (telefoneElem) telefoneElem.value = aluno.telefoneAluno;
        if (dataVencimentoElem) dataVencimentoElem.value = formatarData(aluno.vencimentoFatura);
        
    } catch (error) {
        console.log('Erro ao buscar os dados do aluno:', error);
    }
}

// Função para atualizar um Aluno (UPDATE)
if (window.location.pathname.endsWith("editar_recep.html")){
    // Adicionar eventos aos botões de lápis
    document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const input = event.target.closest('div').querySelector('input');
            if (input) {
                habilitarEdicao(input.id);
            }
        });
    });

    // Encontrar o botão de atualizar
    const btnAtualizar = document.getElementById('editar'); // Supondo que o botão tenha esse ID

    // Adicionar evento para o clique do botão de atualizar
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', async (event) => {
            event.preventDefault(); // Impede o comportamento default (se for um botão de submit)

            // Recuperando o CPF do sessionStorage
            const cpf = sessionStorage.getItem('cpfSelecionado');
            if (!cpf) {
                alert('CPF não encontrado!');
                return;
            }

            const nome = document.getElementById('nomeAtualizado').value;
            const email = document.getElementById('EmailAtualizado').value;
            const telefone = document.getElementById('telefoneAtualizado').value;
            const dataVencimento = document.getElementById('dataVencimentoAtualizado').value;

            if (!dataVencimento || isNaN(Date.parse(dataVencimento))) {
                alert('Por favor, insira uma data de vencimento válida.');
                return;
            }

            try {
                const response = await fetch(`${url}/aluno/editar/${cpf}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nomeAluno: nome,
                        emailAluno: email,
                        telefoneAluno: telefone,
                        vencimentoFatura: converterParaISO( dataVencimento),
                    }),
                });

                if (response.ok) {
                   alert('Dados alterados com sucesso!');
                   return;
                } 

            } catch (error) {
                console.error('Erro ao salvar os dados:', error);
                alert('Erro ao salvar os dados!');
            }
        });
    }
}

// Função para remover um Aluno (REMOVE)
async function removerAluno(cpf) {
    const confirmacao = confirm(`Tem certeza que deseja remover o aluno com CPF ${cpf}?`);

    if (!confirmacao) return;

    try {
        // Faz a requisição de remoção ao back-end
        const response = await fetch(`${url}/aluno/remover/${cpf}`, {
            method: 'DELETE',
        });

        const data = await response.json(); // Agora sempre retorna JSON

        if (response.ok) {
            alert(`Aluno com CPF ${cpf} removido com sucesso!`);
            const areaResultado = document.getElementById('areaResultado');
            areaResultado.classList.add('d-none'); // Esconde a área de resultados
            areaResultado.innerHTML = ''; // Limpa o conteúdo
        } else {
            alert('Erro ao remover Aluno: ' + (data.error || 'Erro desconhecido.'));
        }
    } catch (error) {
        console.error('Erro ao remover aluno:', error);
        alert('Erro ao remover aluno.');
    }
}

//Captura o evento do submit do botão ao enviar, pelo id do formulario;
if (window.location.pathname.endsWith("cadastro_recep.html")){
    document.getElementById("cadastroForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        criarAluno();  
    });
}


/* FUNÇÕES DA BARRA DE BUSCA (EXIBIR/EDITAR/REMOVER) */

// Função para renderizar os resultados da página de busca
function renderizarResultadosBusca(resultadosFiltrados, areaResultado) {
    if (resultadosFiltrados.length > 0) {
        areaResultado.innerHTML = resultadosFiltrados
            .map(result => `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2">
                    <!-- Nome e CPF alinhados à esquerda -->
                    <span>Nome: ${formatarNome(result.nomeAluno)} | CPF: ${result.cpfAluno}</span>
                    
                    <!-- Botão com lupa alinhada à direita -->
                    <button class="btn btn-transparent text-white p-0" onclick="verMais('${result.cpfAluno}')">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            `).join('');
        // Verifica se há mais de 5 itens e aplica o overflow
        if (resultadosFiltrados.length > 5) {
            areaResultado.classList.add('scrollable-results');
        } else {
            areaResultado.classList.remove('scrollable-results');
        }
    } else {
        areaResultado.innerHTML = `<div class="text-center">Nenhum resultado encontrado.</div>`;
    }
}

// Função para renderizar os resultados da página de remoção
function renderizarResultadosRemocao(resultadosFiltrados, areaResultado) {
    if (resultadosFiltrados.length > 0) {
        areaResultado.innerHTML = resultadosFiltrados
            .map(result => `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2">
                    <span>Nome: ${formatarNome(result.nomeAluno)} | CPF: ${result.cpfAluno}</span>
                    <button class="btn btn-transparent text-white p-0 ms-5" onclick="removerAluno('${result.cpfAluno}')">
                        <i class="bi bi-trash text-danger" style="margin-left:60px;"></i>
                    </button>
                </div>
            `).join('');

        // Verifica se há mais de 5 itens e aplica o overflow
        if (resultadosFiltrados.length > 5) {
            areaResultado.classList.add('scrollable-results');
        } else {
            areaResultado.classList.remove('scrollable-results');
        }
    } else {
        areaResultado.innerHTML = `<div class="text-center">Nenhum resultado encontrado.</div>`;
    }
}

// Função para filtrar e renderizar os resultados
function atualizarResultados(fetchResultados = [], searchInput = "") {
    const areaResultado = document.getElementById('areaResultado');

    if (searchInput !== "") {
        // Filtrando o array local com base na entrada do usuário
        const resultadosFiltrados = fetchResultados.filter(result =>
            result.cpfAluno.includes(searchInput)
        );

        if (chavedepagina === 0) {
            renderizarResultadosBusca(resultadosFiltrados, areaResultado);
        } else if (chavedepagina === 1) {
            renderizarResultadosRemocao(resultadosFiltrados, areaResultado);
        }

    } else {
        areaResultado.innerHTML = `<div class="text-center">Digite algo para buscar.</div>`;
    }
}

// Função para buscar os dados do backend
function buscaAluno() {
    const searchInput = document.getElementById('campoPesquisa').value.trim();
    const areaResultado = document.getElementById('areaResultado');

    if (searchInput !== "") {
        areaResultado.classList.remove('d-none'); // Exibe a área de resultados

        fetch(`${url}/aluno/busca/${searchInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro no servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                areaResultado.innerHTML = `<div class="text-center text-danger">CPF não encontrado!</div>`;
                return;
            }

            fetchResultados = Array.isArray(data) ? data : [data];
            atualizarResultados(fetchResultados, searchInput); // Atualiza os resultados
        })
        .catch(error => {

            console.log(error)
            areaResultado.classList.remove('d-none');
            areaResultado.innerHTML = `<div class="text-center text-danger">Erro ao buscar aluno: ${error.message}</div>`;
        });
    } else {
        areaResultado.classList.add('d-none'); // Se o campo de pesquisa estiver vazio, esconde a área de resultados
    }
}

/* OUTRAS FUNÇÕES */

// Função para formatar o nome com duas palavras ou mais
function formatarNome(nomeAluno) {
    const palavraFormatada = nomeAluno.split(" ").slice(0, 2);
    return palavraFormatada.join(" "); // Junta as palavras com espaço
}

// Função para exibir mais detalhes do aluno
function verMais(cpf) {
    sessionStorage.setItem('cpfSelecionado', cpf);
    window.location.href = 'editar_recep.html';
}

// Função para transformar a data de Iso para String (pegar os dados da tabela)
function formatarData(dataISO) {
    const data = new Date(dataISO); // Cria um objeto Date com a string ISO
    return `${data.getUTCFullYear()}-${(data.getUTCMonth() + 1).toString().padStart(2, '0')}-${data.getUTCDate().toString().padStart(2, '0')}`;
}

// Função para transformar a data de String para Iso (enviar para o back como ISO)
function converterParaISO(dataStr) {
    const [ano, mes, dia] = dataStr.split('-');
    const data = new Date(ano, mes - 1, dia); // Meses começam do 0 no JavaScript
    return data.toISOString().split('T')[0]; // Retorna apenas a parte da data (YYYY-MM-DD)
}

// Função para habilitar edição dos campos (CORRETO)
function habilitarEdicao(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.disabled = false;
        campo.focus();
    }
}
  
// Ao ser selecionada uma pessoa, pelo CPF mostra os seus dados
if (cpf) {
    exibirDadosAluno(cpf);
}

// Lógica de exibir a senha (olhinho) 
if(window.location.pathname.endsWith("cadastro_recep.html")){
    document.getElementById('toggleSenha').addEventListener('click', function () {
        const inputSenha = document.getElementById('senha');
        const iconeOlho = document.getElementById('iconeOlho');

        const isPassword = inputSenha.type === 'password';
        inputSenha.type = isPassword ? 'text' : 'password';
        iconeOlho.className = isPassword ? 'bi bi-eye' : 'bi bi-eye-slash';
    });

    document.getElementById('toggleConfSenha').addEventListener('click', function () {
        const inputSenha = document.getElementById('confSenha');
        const iconeOlho = document.getElementById('iconeOlhoConf');

        const isPassword = inputSenha.type === 'password';
        inputSenha.type = isPassword ? 'text' : 'password';
        iconeOlho.className = isPassword ? 'bi bi-eye' : 'bi bi-eye-slash';
    });
}


// Adicionando evento no botão de pesquisa
if (window.location.pathname.endsWith("buscar_recep.html") || window.location.pathname.endsWith("remove_recep.html")) {
    document.querySelector('#pesquisar').addEventListener('click', buscaAluno);
    document.querySelector('#campoPesquisa').addEventListener('input', atualizarResultados); // Atualiza a busca em tempo real
}

if (window.location.pathname.endsWith("area_recep.html")) {
    // Adicionar evento de clique no botão "Sair"
    document.getElementById('btnSair').addEventListener('click', () => {
        // Limpar o token (dependendo de onde está armazenado)
        localStorage.removeItem('token');    // Se o token estiver no localStorage
        sessionStorage.removeItem('token');  // Se o token estiver no sessionStorage

        // Opcional: Limpar outros dados relacionados à sessão, como informações do usuário
        localStorage.removeItem('usuario');  // Exemplo de remoção de dados adicionais
        sessionStorage.removeItem('usuario');

        // Redirecionar o usuário para a página de login ou página inicial
        window.location.href = '../inicio/inicio.html'; 
    });
}
