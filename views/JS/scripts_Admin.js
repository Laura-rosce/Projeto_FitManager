/* INTEGRAÇÃO DA API COM A ARÉA DO ADMINISTRADOR COM O FRONT */

let chavedepagina = 0;
let fetchResultados = []; // Array para armazenar os dados retornados da API

//Chave de controle:
if (window.location.pathname.endsWith("buscar_admin.html")) {
    chavedepagina = 0;  // Página de busca
} else if (window.location.pathname.endsWith("remove_admin.html")) {
    chavedepagina = 1;  // Página de remoção
}

/* CRUD DO SISTEMA */

// Função que cria Recepcionista (CREATE)
async function criarRecep(){
    const usuarioInput = document.getElementById("usuario").value.trim()
    const senhaInput = document.getElementById("senha").value.trim()
    const confirmSenhaInput = document.getElementById("confSenha").value.trim()
    const nomeInput = document.getElementById("nome").value.trim()
    const emailInput = document.getElementById("email").value.trim()
    const telefoneInput = document.getElementById("telefone").value.trim()
    const cpfInput = document.getElementById("cpf").value.trim()

    if(senhaInput !== confirmSenhaInput){
        return alert("Confira se as senhas estão iguais!");
    }

    // Remover a máscara do CPF (apenas números)
    const cpfSemMascara = cpfInput.replace(/\D/g, '');

    const res = confirm("Confirme se todos os dados estão corretos!");

    if (res) {
        try{
            const response = await fetch (`${url}/recepcionista/criar`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    cpfRecep: cpfSemMascara,
                    nomeRecep: nomeInput,
                    emailRecep: emailInput,
                    TelefoneRecep: telefoneInput,
                    usuarioRecep: usuarioInput, 
                    senhaRecep : senhaInput, 
                })
            });

            if(response.ok){
                alert("Recepcionista criado com sucesso!");
                window.location.href = "area_admin.html";
            } else {
                alert('O CPF informado já está cadastrado. Cadastre outro!');
            }

        }catch(error){
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            console.log (error);
        }

    } else {
        console.log('Usuário decidiu conferir os dados.');
        return; 
    }
}

// Função para exibir os dados do recepcionista (READ)
async function exibirDadosRecep(cpf) {
    if (!cpf) {
        console.error('CPF não encontrado.');
        return;
    }

    try {
        const response = await fetch(`${url}/recepcionista/exibir/${cpf}`);
        const data = await response.json();

        if (!data || data.error) {
            console.log('Recepcionista não encontrado.');
            return;
        }

        const recepcionista = Array.isArray(data) ? data[0] : data;

        // Verifica se os elementos existem no DOM antes de definir o textContent
        const nomeElem = document.getElementById('nome');
        const cpfElem = document.getElementById('cpf');
        const emailElem = document.getElementById('email');
        const telefoneElem = document.getElementById('telefone');
        const usuarioElem = document.getElementById('usuario');
        
        if (nomeElem) nomeElem.textContent = recepcionista.nomeRecep;
        if (cpfElem) cpfElem.textContent = recepcionista.cpfRecep;
        if (emailElem) emailElem.textContent = recepcionista.emailRecep;
        if (telefoneElem) telefoneElem.textContent = recepcionista.TelefoneRecep;
        if (usuarioElem) usuarioElem.textContent = recepcionista.usuarioRecep;
    } catch (error) {
        console.log('Erro ao buscar os dados do recepcionista:', error);
    }
}

// Função para remover um recepcionista (REMOVE)
async function removerRecepcionista(cpf) {
    const confirmacao = confirm(`Tem certeza que deseja remover o recepcionista com CPF ${cpf}?`);

    if (!confirmacao) return;

    try {
        // Faz a requisição de remoção ao back-end
        const response = await fetch(`${url}/recepcionista/remover/${cpf}`, {
            method: 'DELETE',
        });

        const data = await response.json(); // Agora sempre retorna JSON

        if (response.ok) {
            alert(`Recepcionista com CPF ${cpf} removido com sucesso!`);
            const areaResultado = document.getElementById('areaResultado');
            areaResultado.classList.add('d-none'); // Esconde a área de resultados
            areaResultado.innerHTML = ''; // Limpa o conteúdo
        } else {
            alert('Erro ao remover recepcionista: ' + (data.error || 'Erro desconhecido.'));
        }
    } catch (error) {
        console.error('Erro ao remover recepcionista:', error);
        alert('Erro ao remover recepcionista.');
    }
}

/* FUNÇÕES PARA A BARRA DE BUSCA */

// Função para exibir mais detalhes do recepcionista
function verMais(cpf) {
    sessionStorage.setItem('cpfSelecionado', cpf);
    window.location.href = 'exibeDados_admin.html';
}

// 🔎  Função para renderizar os resultados da página de exibição 
// (Monta dinamicamente cada nome e cpf encontrado)
function renderizarResultadosBusca(resultadosFiltrados, areaResultado) {
    if (resultadosFiltrados.length > 0) {
        areaResultado.innerHTML = resultadosFiltrados
            .map(result => `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2">
                    <span>Nome: ${formatarNomeBusca(result.nomeRecep)} | CPF: ${result.cpfRecep}</span>
                    <button class="btn btn-transparent text-white p-0 ms-5" onclick="verMais('${result.cpfRecep}')">
                        <i class="bi bi-search" style="margin-left:60px;"></i>
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

// 🗑️ Função para renderizar os resultados da página de remoção 
function renderizarResultadosRemocao(resultadosFiltrados, areaResultado) {
    if (resultadosFiltrados.length > 0) {
        areaResultado.innerHTML = resultadosFiltrados
            .map(result => `
                <div class="d-flex justify-content-between align-items-center p-2 mb-2">
                    <span>Nome: ${formatarNomeBusca(result.nomeRecep)} | CPF: ${result.cpfRecep}</span>
                    <button class="btn btn-transparent text-white p-0 ms-5" onclick="removerRecepcionista('${result.cpfRecep}')">
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

// Função para atualizar os resultados 
//Filtra dados e define ação: visualizar/remover.
function atualizarResultados(fetchResultados = [], searchInput = "") {
    const areaResultado = document.getElementById('areaResultado');

    if (searchInput !== "") {
        // Filtrando o array local com base na entrada do usuário
        const resultadosFiltrados = fetchResultados.filter(result =>
            result.cpfRecep.includes(searchInput)
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

// Função de Requisição para buscar os dados do backend
function buscaRecepcionista() {
    const searchInput = document.getElementById('campoPesquisa').value.trim();
    const areaResultado = document.getElementById('areaResultado');

    if (searchInput !== "") {
        areaResultado.classList.remove('d-none'); // Exibe a área de resultados

        fetch(`${url}/recepcionista/busca/${searchInput}`)
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
            console.error('Erro ao buscar recepcionista:', error);
            areaResultado.classList.remove('d-none');
            areaResultado.innerHTML = `<div class="text-center text-danger">Erro ao buscar recepcionista: ${error.message}</div>`;
        });
    } else {
        areaResultado.classList.add('d-none'); // Se o campo de pesquisa estiver vazio, esconde a área de resultados
    }
}

/* OUTRAS FUNÇÕES */

// Lógica de exibir a senha (olhinho) 
if (window.location.pathname.endsWith("cadastro_admin.html")){
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

// Chama o CREATE do Recepcionista
if (window.location.pathname.endsWith("cadastro_admin.html")){
    document.getElementById("cadastrarRecep").addEventListener("submit", async (event) => {
    event.preventDefault();
    criarRecep();  
    });
}

// Adiciona ações no botão de pesquisa e na barra de busca
if (window.location.pathname.endsWith("buscar_admin.html") || window.location.pathname.endsWith("remove_admin.html")) {
    document.querySelector('#pesquisar').addEventListener('click', buscaRecepcionista);
    document.querySelector('#campoPesquisa').addEventListener('input', atualizarResultados); // Atualiza a busca em tempo real
}

// Função para formatar o nome para apenas 2 palavras na exibição dos nomes
function formatarNomeBusca(nomeRecep) {
    const palavrasParaFormatar = nomeRecep.split(" ").slice(0, 2);
    return palavrasParaFormatar.join(' ');
}

// Obtendo o CPF do sessionStorage
const cpf = sessionStorage.getItem('cpfSelecionado');

// Chama a função para exibir os dados do recepcionista
if (cpf) {
    exibirDadosRecep(cpf);
}
