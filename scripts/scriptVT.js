// Variável global para rastrear o elemento sendo arrastado
let currentDraggedElement = null;

// Flag para controlar se a mensagem de erro já foi mostrada
let mensagemErroJaMostrada = false;

// Controlar qual é o próximo box apócrifo disponível (de 7 a 1)
let proximoBoxApocrifo = 7;

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

// Instanciar cronômetro
const cronometro = new Cronometro();

// Embaralhar livros na entrada da página
window.addEventListener('DOMContentLoaded', function() {
  embaralharLivros();
  setupBookDragListeners();
  setupDropZones();
  
  // Iniciar cronômetro
  cronometro.iniciaCronometro();
  setInterval(() => cronometro.atualizaCronometro(), 1000);
});

function setupBookDragListeners() {
  // Adicionar listeners nas imagens .livro
  const bookImages = document.querySelectorAll(".livro");
  bookImages.forEach(book => {
    book.addEventListener("dragstart", dragStart);
    book.addEventListener("dragend", dragEnd);
  });
  
  // Garantir que imagens box-livro não sejam arrastáveis
  const boxLivros = document.querySelectorAll(".box-livro");
  boxLivros.forEach(boxLivro => {
    boxLivro.setAttribute("draggable", "false");
    boxLivro.style.pointerEvents = "none"; // Desabilitar completamente interação com mouse
  });
}

// (removida) preencherBoxesComLivros: agora as imagens já estão dentro das boxes no HTML

// Define a drag image de 25x60px e hotspot ~no canto inferior direito
function dragStart(event) {
  const img = event.target;
  
  // Apenas permitir drag de imagens com classe "livro"
  if (!img.classList.contains('livro')) {
    event.preventDefault();
    return;
  }
  
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
    // Parar de mover se o drop foi bem-sucedido
    if (img._dropSuccessful || !helper.parentNode) return;
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
  
  // Só limpar o helper se não foi um drop bem-sucedido (já foi removido no evento drop)
  if (img && !img._dropSuccessful) {
    if (img._dragHelper) {
      if (img._dragHelper.parentNode) img._dragHelper.parentNode.removeChild(img._dragHelper);
      delete img._dragHelper;
    }
    if (img._onDragMove) {
      document.removeEventListener('dragover', img._onDragMove);
      delete img._onDragMove;
    }
  }
  
  // Limpar a flag de drop bem-sucedido
  if (img && img._dropSuccessful) {
    delete img._dropSuccessful;
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
  const livrosApocrifos = ['1Mc', '2Mc', 'Br', 'Ecl', 'Jd', 'Sb', 'Tb'];
  
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

      // Verificar se o livro foi colocado no lugar correto
      const boxId = box.getAttribute('data-draggable-id');
      const livroIdSemSufixo = id.replace('_drag', '');
      
      // Verificar se é um livro apócrifo sendo dropado em box normal
      const isLivroApocrifo = livrosApocrifos.includes(livroIdSemSufixo);
      
      // Verificar se é drop incorreto ANTES de mover
      const isDropIncorreto = (boxId !== livroIdSemSufixo) || isLivroApocrifo;
      
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
      
      if (boxId === livroIdSemSufixo) {
        // Marcar que o drop foi bem-sucedido PRIMEIRO para parar onDragMove imediatamente
        dragged._dropSuccessful = true;
        
        // Remover imediatamente o helper
        if (dragged._dragHelper && dragged._dragHelper.parentNode) {
          dragged._dragHelper.parentNode.removeChild(dragged._dragHelper);
          delete dragged._dragHelper;
        }
        if (dragged._onDragMove) {
          document.removeEventListener('dragover', dragged._onDragMove);
          delete dragged._onDragMove;
        }
      } else if (isDropIncorreto) {
        // Drop incorreto - mostrar mensagem de erro
        mostrarMensagemErro();
      }
    });
  });
  
  // Evento especial para boxapocrifos
  setupBoxApocrifosRotation();
}

// Função para mostrar mensagem de erro com animação
function mostrarMensagemErro() {
  // Só mostrar se for a primeira vez
  if (mensagemErroJaMostrada) return;
  
  const mensagem = document.getElementById('mensagem-de-erro');
  const botaoOk = document.getElementById('ok');
  if (!mensagem) return;
  
  // Marcar que a mensagem já foi mostrada
  mensagemErroJaMostrada = true;
  
  // Mostrar a mensagem e o botão permanentemente
  mensagem.style.display = 'block';
  mensagem.style.opacity = '1';
  
  if (botaoOk) {
    botaoOk.style.display = 'block';
  }
}

// Configurar rotação de 90 graus para livros apócrifos sobre boxapocrifos
function setupBoxApocrifosRotation() {
  const boxesApocrifos = document.querySelectorAll('.boxapocrifos');
  const livrosApocrifos = ['1Mc', '2Mc', 'Br', 'Ecl', 'Jd', 'Sb', 'Tb'];
  
  boxesApocrifos.forEach(boxApocrifo => {
    boxApocrifo.addEventListener('dragover', (e) => {
      // Permitir drop apenas no próximo box disponível
      const boxId = boxApocrifo.getAttribute('id');
      const boxNumber = parseInt(boxId.replace('boxapocrifo', ''));
      
      if (boxNumber !== proximoBoxApocrifo) {
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
        return;
      }
      
      // Usar o elemento arrastado armazenado globalmente
      if (currentDraggedElement) {
        const livroId = currentDraggedElement.id.replace('_drag', '');
        
        // Permitir drop apenas se for um livro apócrifo
        if (livrosApocrifos.includes(livroId)) {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
          
          if (currentDraggedElement._dragHelper) {
            // Aplicar rotação de 90 graus no HELPER (imagem que segue o cursor)
            currentDraggedElement._dragHelper.style.transform = 'rotate(90deg)';
          }
        } else {
          // Bloquear o drop para livros não apócrifos
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
        }
      } else {
        e.preventDefault();
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
      
      // Permitir drop apenas no próximo box disponível
      const boxId = boxApocrifo.getAttribute('id');
      const boxNumber = parseInt(boxId.replace('boxapocrifo', ''));
      
      if (boxNumber !== proximoBoxApocrifo) {
        return;
      }
      
      const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
      if (!id) return;
      const dragged = document.getElementById(id);
      if (!dragged) return;
      
      const livroId = id.replace('_drag', '');
      
      // Apenas permitir drop se for um livro apócrifo
      if (!livrosApocrifos.includes(livroId)) {
        // Mostrar mensagem de erro para livro não-apócrifo em box apócrifo
        mostrarMensagemErro();
        return; // Bloqueia o drop de livros não apócrifos
      }
      
      // Marcar que o drop foi bem-sucedido PRIMEIRO para parar onDragMove imediatamente
      dragged._dropSuccessful = true;
      
      // Remover imediatamente o helper
      if (dragged._dragHelper && dragged._dragHelper.parentNode) {
        dragged._dragHelper.parentNode.removeChild(dragged._dragHelper);
        delete dragged._dragHelper;
      }
      if (dragged._onDragMove) {
        document.removeEventListener('dragover', dragged._onDragMove);
        delete dragged._onDragMove;
      }
      
      // Mapeamento de IDs para nomes de arquivos
      const apocrifosMap = {
        '1Mc': '1macabeus',
        '2Mc': '2macabeus',
        'Br': 'baruque',
        'Ecl': 'eclesiastico',
        'Jd': 'judite',
        'Sb': 'sabedoria',
        'Tb': 'tobias'
      };
      
      // Ocultar a imagem draggable
      dragged.style.display = 'none';
      
      // Criar e inserir a imagem correspondente da pasta imagens
      const nomeArquivo = apocrifosMap[livroId];
      if (nomeArquivo) {
        const imgBox = document.createElement('img');
        imgBox.src = `/imagens/${nomeArquivo}.png`;
        imgBox.alt = dragged.alt;
        imgBox.id = livroId;
        imgBox.style.position = 'absolute';
        imgBox.style.top = '0';
        imgBox.style.left = '0';
        imgBox.style.width = '100%';
        imgBox.style.height = '100%';
        imgBox.style.objectFit = 'fill';
        imgBox.style.zIndex = '1';
        imgBox.setAttribute('draggable', 'false');
        imgBox.style.pointerEvents = 'none';
        
        boxApocrifo.appendChild(imgBox);
      }
      
      // Ativar o próximo box (decrementar)
      proximoBoxApocrifo--;
      
      // Se ainda há boxes disponíveis, tornar o próximo visível (100% opacidade)
      if (proximoBoxApocrifo >= 1) {
        const proximoBox = document.getElementById(`boxapocrifo${proximoBoxApocrifo}`);
        if (proximoBox) {
          proximoBox.style.opacity = '1';
        }
      }
    });
  });
}

// Ocultar mensagem de dica
function clicarOk() {
  const mensagemErro = document.getElementById("mensagem-de-erro");
  const botaoOk = document.getElementById("ok");
  
  if (mensagemErro) {
    mensagemErro.style.display = "none";
  }
  
  if (botaoOk) {
    botaoOk.style.display = "none";
  }
}
