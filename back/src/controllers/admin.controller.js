export const autenticarAdministrador = (req, res) => {
    const { chaveAcesso } = req.body;

    // Verifica a chave de acesso com a variável de ambiente
    if (chaveAcesso === process.env.ADMIN_KEY) {
        return res.status(200).send({ message: 'Chave de acesso correta' });
    } else {
        return res.status(400).send({ message: 'Chave de acesso incorreta' });
    }
};