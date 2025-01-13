import {createRecepcionista, getAllRecepcionistas, getRecepcionistaByCpfDinamico, getRecepcionistaByCpfEstatico, deleteRecepcionista, limparTabela } from "../repositorys/recepcionista.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;
const saltRounds = 10;

// Criar Recepcionista
export const createRecepcionistaController = async (req, res) => {
    function formatarNome(nomeAluno) {
        const nomeArray = nomeAluno.split(" ");
        return nomeArray
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
            .join(' ');
    }

    try {
        // Desestruturar os dados recebidos para obter a senha
        const { senhaRecep, cpfRecep, nomeRecep, emailRecep, TelefoneRecep, usuarioRecep } = req.body;

        // Verificar se todos os campos obrigatórios foram passados
        if (!cpfRecep || !nomeRecep || !emailRecep || !usuarioRecep || !senhaRecep) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Criptografar a senha
        const senhaCriptografada = await bcrypt.hash(senhaRecep, saltRounds);

        // Criar o recepcionista com todos os dados e a senha criptografada
        const recepcionistaCriado = await createRecepcionista({
            cpfRecep,          
            nomeRecep: formatarNome(nomeRecep),      
            emailRecep,       
            TelefoneRecep,     
            usuarioRecep,      
            senhaRecep: senhaCriptografada, 
        });

        // Retornar o resultado
        res.status(201).json(recepcionistaCriado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar recepcionista' });
    }
};

// Exibir todos os recepcionistas
export const getAllRecepcionistasController= async (req, res) => {
    try {
        const recepcionistas = await getAllRecepcionistas(); 
        res.status(200).json(recepcionistas); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar recepcionistas' }); 
    }
};

// Obter Recepcionista por CPF Parcial (barra de busca)
export const getRecepcionistaByCpfDinamicoController = async (req, res) => {
    const { cpfRecep } = req.params;
    try {
        // Usando a função do repositório para buscar o recepcionista
        const recepcionista = await getRecepcionistaByCpfDinamico(cpfRecep);
        if (!recepcionista) {
            return res.status(404).json({message: 'Nenhum recepcionista encontrado com esse CPF!' });
        }
        res.status(200).json(recepcionista);
    } catch (error) {
        console.error('Erro ao buscar recepcionista:', error);
        res.status(500).json({ error: 'Erro ao buscar recepcionista' });
    }
};

// Obter Recepcionista por CPF totalmente repassado (exibição de dados)
export const getRecepcionistaByCpfEstaticoController = async (req, res) => {
    const { cpfRecep } = req.params;

    try {
        // Usando a função do repositório para buscar o recepcionista
        const recepcionista = await getRecepcionistaByCpfEstatico(cpfRecep);
        res.status(200).json(recepcionista);
    } catch (error) {
        console.error('Erro ao buscar recepcionista:', error);
        res.status(500).json({ error: 'Erro ao buscar recepcionista' });
    }
};

// Remove Recepcionista
export const deleteRecepcionistaController = async (req, res) => {
    const cpfRecep = req.params.cpfRecep; 
    try {
        await deleteRecepcionista(cpfRecep);
        return res.status(200).json({ message: 'Recepcionista removido com sucesso', cpfRecep });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar recepcionista' });
    }
};

/* LOGIN DO RECEPCIONISTA */

// Autenticação do Recepcionista
export const autenticarRecepcionista = async (req, res) => {
    const {  cpfRecep, senhaRecep } = req.body;

    try {
        const recepcionista = await getRecepcionistaByCpfEstatico(cpfRecep);

        if (!recepcionista) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senhaRecep, recepcionista.senhaRecep);
        
        if (!senhaValida) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: recepcionista.cpfRecep, usuario: recepcionista.usuarioRecep },
            SECRET_KEY,
            { expiresIn: '2d' }
        );

        return res.status(200).json({
            token,
            user: {
                cpfRecep: recepcionista.cpfRecep,
                usuarioRecep: recepcionista.usuarioRecep,
                nomeRecep: recepcionista.nomeRecep,
            },
            message: 'Autenticação bem-sucedida.',
        });
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Renderização dos dados do recepcionista
export const buscarDadosRecepcionista = async (req, res) => {
    try {
        // O middleware `verificarToken` deve ter anexado o usuário decodificado ao `req.user`
        const { id } = req.user; // Aqui estamos pegando o CPF do token (ou outra identificação única)

        // Faça a consulta no banco de dados para buscar o recepcionista
        const recepcionista = await getRecepcionistaByCpfEstatico(id)

        if (!recepcionista) {
            return res.status(404).json({ message: 'Recepcionista não encontrado.' });
        }

        // Retorne os dados do recepcionista
        return res.status(200).json([{
            cpfRecep: recepcionista.cpfRecep,
            nomeRecep: recepcionista.nomeRecep,
            emailRecep: recepcionista.emailRecep,
            telefoneRecep: recepcionista.TelefoneRecep,
        }]);
    } catch (error) {
        console.error('Erro ao buscar dados do recepcionista:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Limpa tabela do Recepcionista
export const limpaTabelaController = async (req, res) => {
    try {
        limparTabela();
        res.status(200).json({ message: 'Dados da tabela de recepcionista apagados.' });
      } catch (error) {
        console.error('Erro ao limpar dados da tabela de recepcionista:', error);
        res.status(500).json({ message: 'Erro ao tentar limpar os dados.' });
      }
}



