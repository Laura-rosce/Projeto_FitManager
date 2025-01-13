// ELEMENTO COSTUMIZÁVEL DO TÍTULO DE CADASTRO (SE REPETE)
class Titulo extends HTMLElement{
    constructor() {
      super();
    }

    connectedCallback() {
      const titulo = this.getAttribute('titulo') || 'Cadastro';
      const icon = this.getAttribute('icon') || 'bi-person-circle'; // Obtém o atributo 'icon'
      const div = document.createElement("div");
      div.className = "w-100";
      
      div.innerHTML = `
          <div class="text-center mb-3">
              <i class="bi ${icon} display-4"></i>
              <h1 class="mt-3">${titulo}</h1>
          </div>
      `;
      this.appendChild(div);
    }
  
  }
  
  customElements.define("meu-titulo", Titulo);

  