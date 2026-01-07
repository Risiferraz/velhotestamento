// Função para embaralhar a ordem das imagens dos livros
function shuffleBooks() {
  const boxdrag = document.getElementById('boxdrag');
  const draggableDiv = boxdrag.querySelector('.draggable');
  if (!draggableDiv) return;
  
  const books = Array.from(draggableDiv.querySelectorAll('.livro'));
  
  // Fisher-Yates shuffle algorithm
  for (let i = books.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = books[i];
    books[i] = books[j];
    books[j] = temp;
  }
  
  // Remover todas as imagens
  books.forEach(book => book.remove());
  
  // Reinseri-las na ordem embaralhada
  books.forEach(book => draggableDiv.appendChild(book));
}

// Proportional scaling of the entire game area
(function setupStageScaling() {
  const BASE_WIDTH = 750;
  const BASE_HEIGHT = 850;
  const MAX_VISUAL_WIDTH = 800; // limita a largura visual máxima
  function scaleStage() {
    const stageEl = document.getElementById('game-base');
    const stageWrapper = document.getElementById('stage');
    if (!stageEl || !stageWrapper) return;
    // Usar o tamanho interno disponível do wrapper (considera padding)
    const availableWidth = stageWrapper.clientWidth;
    const availableHeight = stageWrapper.clientHeight;
    const scaleW = Math.min(availableWidth, MAX_VISUAL_WIDTH) / BASE_WIDTH;
    const scale = Math.min(scaleW, availableHeight / BASE_HEIGHT);
    const scaledWidth = BASE_WIDTH * scale;
    const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
    stageEl.style.transform = `translate(${offsetX}px, 0) scale(${scale})`;
  }
  window.addEventListener('resize', scaleStage);
  window.addEventListener('DOMContentLoaded', scaleStage);
})();

// Embaralhar livros na entrada da página
window.addEventListener('DOMContentLoaded', shuffleBooks);

const draggableElements = document.querySelectorAll("#draggable");//os elementos dragáveis são id=draggable
const droppableElements = document.querySelectorAll("#box");//os elementos dropáveis são de id= box

draggableElements.forEach(elem => {//para cada elemento DRAGÁVEL...
  elem.addEventListener("dragstart", dragStart);//quando o evento (o usuário começa a arrastar um item)
//a função drag Star será acionada
});

droppableElements.forEach(elem => {//para cada elemento DROPÁVEL...
  elem.addEventListener("dragover", dragOver); // quando o evento (um item arrastado está passando sobre um alvo de queda válido, aciona a função DARG OVER
  elem.addEventListener("dragleave", dragLeave); // quando o evento (o mouse é liberado) é acionada a função
  elem.addEventListener("drop", dragDrop); // quando o evento (um item dragável é liberado sobre um item dropável a função é acionada
});

//Eventos acionados no elemento drag

function dragStart(event) {//quando ocorrer o evento (dragstar) a função (dragStar) será acionada
  event.dataTransfer.setData("text/plain", event.target.id);
}

//Eventos acionados no elemento drop target

function dragOver(event) {//quando ocorrer o evento (dragover) a função (dragOver) será acionada
  event.preventDefault(); // impede o comportamento padrão (default) permitindo o "drop"
  //add.style.transitionDelay = "2s";
}

function dragLeave(event) {
  if(!event.target.classList.contains("dropped")) {
  event.target.classList.remove("box:hover");
  }
}

function dragDrop(event) {
  event.preventDefault();
  var data = event.target.getAttribute("data-draggable-id");
  event.target.appendChild(document.getElementById(data)); 
  data.style
}

