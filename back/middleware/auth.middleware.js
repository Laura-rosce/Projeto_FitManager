import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export const validarEntrada = (req, res, next) => {
    const { cpfRecep, senhaRecep } = req.body;

    if (!cpfRecep || !senhaRecep) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    next();
};

export const autenticarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrai o token
    
    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Decodifica e verifica o token
        req.user = decoded; // Armazena os dados do usuário decodificados no objeto `req`
        next(); // Permite que a requisição continue
    } catch (error) {
        console.error('Token inválido:', error);
        return res.status(401).json({ message: 'Token inválido.' });
    }
};



