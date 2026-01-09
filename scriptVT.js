// Variável global para rastrear o elemento sendo arrastado
let currentDraggedElement = null;

// Função para embaralhar a ordem das imagens dos livros
function embaralharLivros() {
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
(function escalaDinamicaPagina() {
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
window.addEventListener('DOMContentLoaded', function() {
  embaralharLivros();
  setupBookDragListeners();
  setupDropZones();
});

function setupBookDragListeners() {
  // Adicionar listeners nas imagens .livro
  const bookImages = document.querySelectorAll(".livro");
  bookImages.forEach(book => {
    book.addEventListener("dragstart", dragStart);
    book.addEventListener("dragend", dragEnd);
  });
}

// (removida) preencherBoxesComLivros: agora as imagens já estão dentro das boxes no HTML

// Define a drag image de 25x60px e hotspot ~no canto inferior direito
function dragStart(event) {
  const img = event.target;
  currentDraggedElement = img; // Armazena referência global
  // Garante que temos um id para o drop usar
  if (img && img.id) {
    event.dataTransfer.setData("text/plain", img.id);
  }
  // Permite movimentação e registra o elemento pai de origem para possíveis trocas
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
  img._sourceParent = img.parentElement;
  
  // Ocultar a imagem original durante o arraste
  img.style.opacity = '0';
  
  const ghostW = 25;
  const ghostH = 60;
  // 1) criar um helper visual 25x60 totalmente opaco que segue o cursor
  const helper = new Image();
  helper.src = img.src;
  helper.width = ghostW;
  helper.height = ghostH;
  helper.style.width = ghostW + 'px';
  helper.style.height = ghostH + 'px';
  helper.style.position = 'fixed';
  helper.style.left = '0px';
  helper.style.top = '0px';
  helper.style.pointerEvents = 'none';
  helper.style.userSelect = 'none';
  helper.style.zIndex = '2147483647';
  helper.style.opacity = '1';
  helper.style.transformOrigin = 'center center';
  document.body.appendChild(helper);
  const offsetX = ghostW * 0.5; // hotspot centralizado
  const offsetY = ghostH * 0.5;
  const onDragMove = (e) => {
    helper.style.left = (e.clientX - offsetX) + 'px';
    helper.style.top = (e.clientY - offsetY) + 'px';
  };
  document.addEventListener('dragover', onDragMove);
  img._dragHelper = helper;
  img._onDragMove = onDragMove;
  // 2) ocultar o ghost nativo usando um canvas transparente 1x1
  if (event.dataTransfer && event.dataTransfer.setDragImage) {
    const blank = document.createElement('canvas');
    blank.width = 1;
    blank.height = 1;
    event.dataTransfer.setDragImage(blank, 0, 0);
  }
}

function dragEnd(event) {
  const img = event.target;
  currentDraggedElement = null; // Limpa referência global
  
  // Restaurar a opacidade da imagem original
  if (img) img.style.opacity = '1';
  
  if (img && img._dragHelper) {
    if (img._dragHelper.parentNode) img._dragHelper.parentNode.removeChild(img._dragHelper);
    delete img._dragHelper;
  }
  if (img && img._onDragMove) {
    document.removeEventListener('dragover', img._onDragMove);
    delete img._onDragMove;
  }
  
  // Verificar se o livro foi depositado no box correto
  if (img && img.parentElement && img.parentElement.classList.contains('box')) {
    const box = img.parentElement;
    const boxId = box.getAttribute('data-draggable-id');
    const livroId = img.id;
    
    // Remover o sufixo "_drag" do ID do livro para comparar com o ID do box
    const livroIdSemSufixo = livroId.replace('_drag', '');
    
    // Se o id do livro (sem "_drag") corresponde ao id do box
    if (boxId === livroIdSemSufixo) {
      // Ocultar a imagem do livro arrastável
      img.style.display = 'none';
      
      // Mostrar o box-livro correspondente
      const boxLivro = box.querySelector('.box-livro');
      if (boxLivro) {
        boxLivro.style.display = 'block';
      }
    }
  }
}

// Torna todas as .box dropáveis, exceto as com id="vazia"
function setupDropZones() {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    // Necessário para que o elemento seja considerado alvo de drop
    box.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      box.classList.add('droppable-hover');
    });

    box.addEventListener('dragenter', () => {
      box.classList.add('droppable-hover');
    });

    box.addEventListener('dragleave', () => {
      box.classList.remove('droppable-hover');
    });

    box.addEventListener('drop', (e) => {
      e.preventDefault();
      box.classList.remove('droppable-hover');
      const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
      if (!id) return;
      const dragged = document.getElementById(id);
      if (!dragged) return;

      // Evita operações redundantes
      if (dragged.parentElement === box) return;

      const sourceParent = dragged._sourceParent || dragged.parentElement;
      const existing = box.querySelector('.livro');

      // Se já houver um livro na box alvo e não for o mesmo, faz swap: devolve o existente para a origem
      if (existing && existing !== dragged) {
        if (sourceParent) sourceParent.appendChild(existing);
      }

      // Move o livro arrastado para a box alvo
      box.appendChild(dragged);
    });
  });
  
  // Evento especial para boxapocrifos
  setupBoxApocrifosRotation();
}

// Configurar rotação de 90 graus para livros apócrifos sobre boxapocrifos
function setupBoxApocrifosRotation() {
  const boxesApocrifos = document.querySelectorAll('.boxapocrifos');
  const livrosApocrifos = ['1Mc', '2Mc', 'Br', 'Ecl', 'Jd', 'Sb', 'Tb'];
  
  boxesApocrifos.forEach(boxApocrifo => {
    boxApocrifo.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      
      // Usar o elemento arrastado armazenado globalmente
      if (currentDraggedElement && currentDraggedElement._dragHelper) {
        const livroId = currentDraggedElement.id.replace('_drag', '');
        
        // Verificar se é um livro apócrifo
        if (livrosApocrifos.includes(livroId)) {
          // Aplicar rotação de 90 graus no HELPER (imagem que segue o cursor)
          currentDraggedElement._dragHelper.style.transform = 'rotate(90deg)';
        }
      }
    });
    
    boxApocrifo.addEventListener('dragleave', (e) => {
      // Remover rotação quando sair do box apócrifo
      if (currentDraggedElement && currentDraggedElement._dragHelper) {
        const livroId = currentDraggedElement.id.replace('_drag', '');
        if (livrosApocrifos.includes(livroId)) {
          currentDraggedElement._dragHelper.style.transform = '';
        }
      }
    });
    
    boxApocrifo.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
      if (!id) return;
      const dragged = document.getElementById(id);
      if (!dragged) return;
      
      const livroId = id.replace('_drag', '');
      
      // Se for um livro apócrifo, manter a rotação
      if (livrosApocrifos.includes(livroId)) {
        dragged.style.transform = 'rotate(90deg)';
      }
      
      // Move o livro para o box
      boxApocrifo.appendChild(dragged);
    });
  });
}
