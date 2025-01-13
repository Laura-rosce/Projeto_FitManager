/* INTEGRAÇÃO DA API COM A AUTENTICAÇÃO DO RECEPCIONISTA E LÓGICA DE AUTENTICAÇÃO DO ADMIN */

// Função de autenticação do Administrador
async function autenticarAdministrador() {
    const chaveAcesso = document.getElementById('senha').value;

    try {
        // Envia a chave para o servidor para validação
        const response = await fetch(`${url}/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chaveAcesso })
        });

        const data = await response.json();

        // Se a chave estiver correta, redireciona o usuário
        if (response.ok) {
            window.location.href = '../admin/area_admin.html';
        } else {
            alert(data.message); // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao autenticar o administrador:', error);
        alert('Erro ao autenticar o administrador. Tente novamente.');
    }
}

// Função de autenticação do Recepcionista (Faz Requisição, geração do Token e armazenamento no LocalStorage)
async function autenticarRecepcionista(){
        const cpf = document.getElementById('cpf').value;
        const senha = document.getElementById('senha').value;

        // Verificando se os campos estão preenchidos
        if (!cpf || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Enviar uma solicitação POST para autenticar o recepcionista
            const response = await fetch(`${url}/recepcionista/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cpfRecep: cpf,
                    senhaRecep: senha,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Se o login for bem-sucedido, salvar o token no localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user)); // Armazenando dados do usuário, se necessário

                window.location.href = '../recepcionista/area_recep.html';
            } else {
                // Caso a autenticação falhe, exibe a mensagem de erro
                alert(data.message || 'Erro na autenticação.');
            }
        } catch (error) {
            console.error('Erro ao autenticar:', error);
            alert('Erro ao autenticar. Tente novamente.');
        }
};


// Lógica de exibir a senha (olhinho) 
document.getElementById('toggleSenha').addEventListener('click', function () {
    const inputSenha = document.getElementById('senha');  
    const iconeOlho = document.getElementById('iconeOlho');

    const isPassword = inputSenha.type === 'password';
    inputSenha.type = isPassword ? 'text' : 'password';

    // Alterna as classes do ícone sem if/else
    iconeOlho.classList.toggle('bi-eye-slash', isPassword);
    iconeOlho.classList.toggle('bi-eye', !isPassword);
});