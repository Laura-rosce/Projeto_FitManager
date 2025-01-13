// Função para formatação do CPF, utiliza a biblioteca Inputmask (precisa instalar)
window.addEventListener("DOMContentLoaded", function () {
    var cpfInput = document.getElementById("cpf");
    if (cpfInput) {
        var mask = new Inputmask("999.999.999-99");
        mask.mask(cpfInput);  // Aplica a máscara ao campo CPF
    }
});