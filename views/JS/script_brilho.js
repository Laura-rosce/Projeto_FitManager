/*✨ RESPONSÁVEL PELA BRILHAÇÃO QUE SAI DO MOUSE ✨*/
const glitterContainer = document.getElementById('glitter-container');

document.addEventListener('mousemove', function (e) {
  createGlitter(e.clientX, e.clientY);
});

function createGlitter(x, y) {
  // Criar o efeito de glitter (partículas)
  const glitter = document.createElement('div');
  glitter.classList.add('glitter');
  
  // Posicionar as partículas no mouse
  glitter.style.left = `${x}px`;
  glitter.style.top = `${y}px`;
  
  // Adicionar o glitter ao container
  glitterContainer.appendChild(glitter);

  // Remover o glitter depois de um tempo (quando ele desaparecer)
  setTimeout(() => {
    glitter.remove();
  }, 1000);  // Tempo do glitter permanecer na tela
}
