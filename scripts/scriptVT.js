// Evento para somar 10 pontos ao clicar na mensagem de acerto
window.addEventListener('DOMContentLoaded', function () {
  const mensagemLivro = document.getElementById('mensagem-livro-escolhido');
  if (mensagemLivro) {
    mensagemLivro.style.cursor = 'pointer';
    let clicado = false;
    mensagemLivro.addEventListener('click', function handler() {
      if (clicado) return;
      clicado = true;
      mensagemLivro.classList.add('clicado');
      // Só permite se o nome do livro escolhido coincidir com o de ultimo-livro
      const nomeEscolhido = document.getElementById('nome-livro-escolhido');
      const nomeUltimo = document.getElementById('nome-ultimo-livro');
      if (!nomeEscolhido || !nomeUltimo) return;
      const nome1 = (nomeEscolhido.textContent || '').trim().toUpperCase();
      const nome2 = (nomeUltimo.textContent || '').trim().toUpperCase();
      if (nome1 && nome2 && nome1 === nome2) {
        // Pega o elemento da pontuação final
        const pontuacaoFinalElemento = document.getElementById('mostra-pontuacao-final');
        if (pontuacaoFinalElemento) {
          let valor = parseFloat(pontuacaoFinalElemento.textContent.replace(',', '.')) || 0;
          console.log('[Antes do acréscimo] Pontuação atual:', valor);
          valor += 1.00;
          // Garante sempre duas casas decimais
          pontuacaoFinalElemento.textContent = valor.toFixed(2).replace('.', ',');
          console.log('[Depois do acréscimo] Nova pontuação:', valor.toFixed(2));
        }
      }
      // Troca o texto da div pelo texto solicitado
      mensagemLivro.innerHTML = 'Veja abaixo sua pontuação.';
      // Após 5 segundos, faz a div desaparecer suavemente
      setTimeout(() => {
        mensagemLivro.style.transition = 'opacity 1s';
        mensagemLivro.style.opacity = '0';
        // Opcional: após o fade, pode ocultar completamente
        setTimeout(() => {
          mensagemLivro.style.display = 'none';
        }, 1000);
      }, 5000);
      // Remove o handler para garantir apenas um clique
      mensagemLivro.removeEventListener('click', handler);
    });
  }
});
// Função para verificar se o livro escolhido é igual ao último livro sorteado
function verificarSeAcertouLivro() {
  const nomeEscolhido = document.getElementById('nome-livro-escolhido');
  const nomeUltimo = document.getElementById('nome-ultimo-livro');
  const mensagemDiv = document.getElementById('mensagem-livro-escolhido');
  if (!nomeEscolhido || !nomeUltimo || !mensagemDiv) return;
  const nome1 = (nomeEscolhido.textContent || '').trim().toUpperCase();
  const nome2 = (nomeUltimo.textContent || '').trim().toUpperCase();
  if (nome1 && nome2 && nome1 === nome2) {
    mensagemDiv.innerHTML = 'PARABÉNS VOCÊ ACERTOU<br>CLIQUE AQUI PARA GANHAR UNS PONTOS EXTRAS.';
  } else {
    mensagemDiv.innerHTML = 'Você não acertou o livro.<br>Veja abaixo sua pontuação.';
  }
}
// FUNÇÕES RELACIONADAS À PÁGINA INICIAL
function clicarStart() {
  const paginaInicial = document.getElementById('pagina-inicial');
  const container = document.querySelector('.container');
  if (paginaInicial) {
    paginaInicial.style.display = 'none';
  }
  if (container) {
    container.style.display = 'grid';
  }
}

function selecionarOpcao(elementoSelecionado) { // Função para selecionar uma opção na lista de opções
  const opcoes = document.querySelectorAll('.lista-de-opcoes .opcoes'); // Seleciona todas as opções dentro da lista de opções
  opcoes.forEach(opcao => { // Percorre todas as opções
    if (opcao === elementoSelecionado) { // Se(ou quando) uma opção for a selecionada
      opcao.style.display = 'block'; // A opção selecionada é exibida
    } else {
      opcao.style.display = 'none'; // As outras opções são ocultadas
    }
  });
  const lista = document.querySelector('.lista-de-opcoes'); // busca no HTML o elemento com a classe lista-de-opcoes e armazena na variável lista.
  if (lista) {
    lista.classList.remove('livro-escolhido-da-lista-de-opcoes'); // Remove antes para evitar acúmulo
    lista.classList.add('livro-escolhido-da-lista-de-opcoes');
    lista.style.display = 'flex'; // Sobrescreve o display: none do estado inicial
  }
  const botaoSelecionar = document.getElementById('selecionar-opcoes'); // busca o elemento com o id selecionar-opcoes e armazena na variável botaoSelecionar.
  if (botaoSelecionar) {
    botaoSelecionar.style.display = 'none'; //Se esse botão existir, ele é ocultado (display: 'none'), ou seja, deixa de aparecer na tela.
  }

  // NOVO: Copiar nome do livro selecionado para a div #livro-escolhido
  const nomeLivroH1 = document.getElementById('nome-livro-escolhido');
  if (nomeLivroH1 && elementoSelecionado) {
    nomeLivroH1.textContent = elementoSelecionado.textContent;
  }
}

function clicarOpcoes() {
  document.querySelector('.lista-de-opcoes').style.display = 'block';
}

// Função para dimensionamento proporcional de toda a área de jogo
(function escalaDinamicaPagina() {
  const BASE_WIDTH = 750;
  const BASE_HEIGHT = 850;
  const MAX_VISUAL_WIDTH = 800; // limita a largura visual máxima
  function scaleStage() {
    // Desativa escala dinâmica em telas pequenas
    if (window.innerWidth <= 480) {
      const stageEl = document.getElementById('game-base');
      const paginaInicial = document.getElementById('pagina-inicial');
      if (stageEl) stageEl.style.transform = '';
      if (paginaInicial) paginaInicial.style.transform = '';
      return;
    }
    const stageEl = document.getElementById('game-base');
    const stageWrapper = document.getElementById('stage');
    if (stageEl && stageWrapper) {
      // Usar o tamanho interno disponível do wrapper (considera padding)
      const availableWidth = stageWrapper.clientWidth;
      const availableHeight = stageWrapper.clientHeight;
      const scaleW = Math.min(availableWidth, MAX_VISUAL_WIDTH) / BASE_WIDTH;
      const scale = Math.min(scaleW, availableHeight / BASE_HEIGHT);
      const scaledWidth = BASE_WIDTH * scale;
      const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
      stageEl.style.transform = `translate(${offsetX}px, 0) scale(${scale})`;
    }
    // Escala dinâmica para a tela inicial
    const paginaInicial = document.getElementById('pagina-inicial');
    if (paginaInicial && stageWrapper) {
      const availableWidth = stageWrapper.clientWidth;
      const availableHeight = stageWrapper.clientHeight;
      const scaleW = Math.min(availableWidth, MAX_VISUAL_WIDTH) / BASE_WIDTH;
      const scale = Math.min(scaleW, availableHeight / BASE_HEIGHT);
      const scaledWidth = BASE_WIDTH * scale;
      const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
      paginaInicial.style.transform = `translate(${offsetX}px, 0) scale(${scale})`;
      paginaInicial.style.transformOrigin = 'top left';
    }
  }
  window.addEventListener('resize', scaleStage);
  window.addEventListener('DOMContentLoaded', scaleStage);
})();

// Variável global para rastrear o elemento sendo arrastado
let currentDraggedElement = null;

// Flag para controlar se a mensagem de erro já foi mostrada
let mensagemErroJaMostrada = false;

// Controlar qual é o próximo box apócrifo disponível (de 7 a 1)
let proximoBoxApocrifo = 7;

// Contadores para verificar fim de jogo
let livrosNormaisDropados = 0; // Total: 39 livros normais
let livrosApocrifosDropados = 0; // Total: 7 livros apócrifos
const TOTAL_LIVROS_NORMAIS = 39;
const TOTAL_LIVROS_APOCRIFOS = 7;

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
// Proportional scaling of the game base only
(function escalaDinamicaGameBase() {
  const BASE_WIDTH = 750;
  const BASE_HEIGHT = 850;
  const MAX_VISUAL_WIDTH = 800; // limita a largura visual máxima
  function scaleStageGameBase() {
    // Desativa escala dinâmica em telas pequenas
    if (window.innerWidth <= 480) {
      const stageEl = document.getElementById('game-base');
      const paginaInicial = document.getElementById('pagina-inicial');
      if (stageEl) stageEl.style.transform = '';
      if (paginaInicial) paginaInicial.style.transform = '';
      return;
    }
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
  window.addEventListener('resize', scaleStageGameBase);
  window.addEventListener('DOMContentLoaded', scaleStageGameBase);
})();

// Instanciar cronômetro
const cronometro = new Cronometro();
// Embaralhar livros na entrada da página
window.addEventListener('DOMContentLoaded', function () {
  embaralharLivros();
  setupBookDragListeners();
  setupDropZones();

  // Atualizar nome do último livro sorteado
  const draggableDiv = document.querySelector('.draggable');
  const livros = draggableDiv ? Array.from(draggableDiv.querySelectorAll('.livro')) : [];
  if (livros.length > 0) {
    // Agora pega o PRIMEIRO da lista
    const primeiroLivro = livros[0];
    const nomePrimeiroLivro = (primeiroLivro.getAttribute('alt') || primeiroLivro.textContent || '').toUpperCase();
    // Console log do primeiro livro da lista de dragáveis
    console.log('Primeiro livro na lista .draggable:', nomePrimeiroLivro, 'ID:', primeiroLivro.id);
    const nomeUltimoLivroH1 = document.getElementById('nome-ultimo-livro');
    if (nomeUltimoLivroH1) {
      nomeUltimoLivroH1.textContent = nomePrimeiroLivro;
    }
  }
  // Iniciar cronômetro
  cronometro.iniciaCronometro();
  setInterval(() => cronometro.atualizaCronometro(), 1000);
});

function setupBookDragListeners() {  // Adicionar listeners nas imagens .livro
  const bookImages = document.querySelectorAll(".livro");
  bookImages.forEach(book => {
    book.addEventListener("dragstart", dragStart); // Adiciona o evento dragstart para iniciar o arraste
    book.addEventListener("dragend", dragEnd); // Adiciona o evento dragend para finalizar o arraste
  });

  const boxLivros = document.querySelectorAll(".box-livro");
  boxLivros.forEach(boxLivro => {
    boxLivro.setAttribute("draggable", "false");
    boxLivro.style.pointerEvents = "none"; // Desabilitar completamente interação com mouse
  });
}

function dragStart(event) {
  const img = event.target;
  if (!img.classList.contains('livro')) {
    event.preventDefault();   // Apenas permite drag de imagens com classe "livro"
    return;
  }

  currentDraggedElement = img; // Armazena referência global
  // Garante que temos um id para o drop usar
  if (img && img.id) { // se imagem e id existirem ...
    event.dataTransfer.setData("text/plain", img.id); // define o id da imagem como dado de transferência
  }
  // Permite movimentação e registra o elemento pai de origem para possíveis trocas
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
  img._sourceParent = img.parentElement;
  img._dropSuccessful = false; // Inicializa flag de drop bem-sucedido
  // Ocultar a imagem original durante o arraste
  img.style.opacity = '0';

  // 1) criar um helper visual que segue o cursor
  const helper = new Image();
  helper.src = img.src;
  helper.className = 'ghost-helper';
  helper.style.position = 'fixed';
  helper.style.left = '0px';
  helper.style.top = '0px';
  helper.style.pointerEvents = 'none';
  helper.style.userSelect = 'none';
  helper.style.zIndex = '2147483647';
  helper.style.opacity = '1';
  helper.style.transformOrigin = 'center center';
  document.body.appendChild(helper);
  const ghostW = 32;
  const ghostH = 77;
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
      // Se a box está bloqueada, não permite mais drop
      if (box.classList.contains('locked-drop')) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      box.classList.add('droppable-hover');
    });

    box.addEventListener('dragenter', () => {
      if (box.classList.contains('locked-drop')) return;
      box.classList.add('droppable-hover');
    });

    box.addEventListener('dragleave', () => {
      if (box.classList.contains('locked-drop')) return;
      box.classList.remove('droppable-hover');
    });

    box.addEventListener('drop', (e) => {
      // Se a box está bloqueada, não permite mais drop
      if (box.classList.contains('locked-drop')) return;
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

      // Se já houver um livro na box alvo e não for o mesmo, faz swap: devolve o existente para a origem
      const existing = box.querySelector('.livro');
      const sourceParent = dragged._sourceParent;
      if (existing && existing !== dragged) {
        if (sourceParent) sourceParent.appendChild(existing);
      }

      // Move o livro arrastado para a box alvo
      box.appendChild(dragged);

      if (boxId === livroIdSemSufixo) {
        // Marcar que o drop foi bem-sucedido PRIMEIRO para parar onDragMove imediatamente
        dragged._dropSuccessful = true;

        // Acrescentar pontuação por acerto
        acrescentarPontuacao(true);

        // Incrementar contador de livros normais dropados
        livrosNormaisDropados++;

        // Remover imediatamente o helper
        if (dragged._dragHelper && dragged._dragHelper.parentNode) {
          dragged._dragHelper.parentNode.removeChild(dragged._dragHelper);
          delete dragged._dragHelper;
        }
        if (dragged._onDragMove) {
          document.removeEventListener('dragover', dragged._onDragMove);
          delete dragged._onDragMove;
        }

        // Bloquear mais drops nesta box
        box.classList.add('locked-drop');

        // Verificar se o jogo acabou
        verificarFimDeJogo();
      } else if (isDropIncorreto) {
        // Drop incorreto - mostrar mensagem de erro
        mostrarMensagemErro();

        // Diminuir pontuação por erro
        acrescentarPontuacao(false);
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
      // Se a box está bloqueada, não permite mais drop
      if (boxApocrifo.classList.contains('locked-drop')) return;
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
        e.preventDefault(); // Permitir dragover mesmo sem elemento (precaução)
      }
    });

    boxApocrifo.addEventListener('dragleave', (e) => {
      if (boxApocrifo.classList.contains('locked-drop')) return;
      // Remover rotação quando sair do box apócrifo
      if (currentDraggedElement && currentDraggedElement._dragHelper) {
        const livroId = currentDraggedElement.id.replace('_drag', '');
        if (livrosApocrifos.includes(livroId)) {
          currentDraggedElement._dragHelper.style.transform = '';
        }
      }
    });

    boxApocrifo.addEventListener('drop', (e) => { // Evento drop específico para boxapocrifos
      // Se a box está bloqueada, não permite mais drop
      if (boxApocrifo.classList.contains('locked-drop')) return;
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

        // Diminuir pontuação por erro
        acrescentarPontuacao(false);

        return; // Bloqueia o drop de livros não apócrifos
      }

      // Marcar que o drop foi bem-sucedido PRIMEIRO para parar onDragMove imediatamente
      dragged._dropSuccessful = true;

      // Acrescentar pontuação por acerto
      acrescentarPontuacao(true);

      // Incrementar contador de livros apócrifos dropados
      livrosApocrifosDropados++;

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

      // Bloquear mais drops nesta box apócrifa
      boxApocrifo.classList.add('locked-drop');

      // Ativar o próximo box (decrementar)
      proximoBoxApocrifo--;

      // Se ainda há boxes disponíveis, tornar o próximo visível (100% opacidade)
      if (proximoBoxApocrifo >= 1) {
        const proximoBox = document.getElementById(`boxapocrifo${proximoBoxApocrifo}`);
        if (proximoBox) {
          proximoBox.style.opacity = '1';
        }
      }

      // Verificar se o jogo acabou
      verificarFimDeJogo();
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

function verificarFimDeJogo() {  // Verificar se todos os livros foram dropados corretamente
  if (livrosNormaisDropados === TOTAL_LIVROS_NORMAIS && livrosApocrifosDropados === TOTAL_LIVROS_APOCRIFOS) {
    fimDeJogo();
  }
}

function fimDeJogo() {
  cronometro.pararCronometro();   // Parar cronômetro
  pontuacaoFinal(); // Chamar função pontuacaoFinal
  acrescerPontuacaoTempo();
  function acrescerPontuacaoTempo() {
    // 1. Pegar número do indicador (ou marca-pontuacao)
    let indicadorNum = 0;
    const indicadorElemento = document.getElementById("indicador");
    if (indicadorElemento) {
      indicadorNum = parseFloat(indicadorElemento.textContent.replace(',', '.')) || 0;
    } else {
      // Tentar pegar de marca-pontuacao se não achar indicador
      const marcaPontuacao = document.getElementById("marca-pontuacao");
      if (marcaPontuacao) {
        indicadorNum = parseFloat(marcaPontuacao.textContent.replace(',', '.')) || 0;
      }
    }

    // 2. Pegar número do cronômetro e transformar em m,ss (float)
    let tempoStr = cronometro.pegaRelogio();
    let tempoFloat = 0;
    if (tempoStr) {
      let partes = tempoStr.split(":");
      if (partes.length === 2) {
        // mm:ss
        let min = parseInt(partes[0], 10);
        let seg = parseInt(partes[1], 10);
        tempoFloat = parseFloat(min + "." + (seg < 10 ? "0" + seg : seg));
      } else if (partes.length === 3) {
        // hh:mm:ss (ignorar horas, usar só mm:ss)
        let min = parseInt(partes[1], 10);
        let seg = parseInt(partes[2], 10);
        tempoFloat = parseFloat(min + "." + (seg < 10 ? "0" + seg : seg));
      }
    }

    // 3. Subtrair tempoFloat de indicadorNum
    let resultado = +(indicadorNum - tempoFloat).toFixed(2);

    // Log explicando a operação matemática
    console.log(
      `[Pontuação Tempo] indicador: ${indicadorNum}, tempo (m,ss): ${tempoFloat}, operação: ${indicadorNum} - ${tempoFloat} = ${resultado}`
    );

    // Transferir resultado para mostra-pontuacao-final
    const pontuacaoFinalElemento = document.getElementById("mostra-pontuacao-final");
    if (pontuacaoFinalElemento) {
      pontuacaoFinalElemento.textContent = resultado;
    }
  }

  const tempoFinalElemento = document.getElementById('mostra-tempo-final');
  if (tempoFinalElemento) {
    tempoFinalElemento.textContent = cronometro.pegaRelogio();
  }

  const mensagemFinal = document.getElementById('mensagem-final'); // Seleciona a div da mensagem final
  if (mensagemFinal) { // Se a div existir ...
    mensagemFinal.style.display = 'grid'; // Exibe a mensagem final (grid para centralizar)
    mensagemFinal.style.opacity = '1';

    setTimeout(function () {  // Após 5 segundos, aplicar efeito piscante e mostrar mensagem de acerto/erro
      verificarSeAcertouLivro();  // Chamar a função de verificação e mostrar mensagem

      const livroEscolhido = document.getElementById('livro-escolhido'); // Seleciona a div do livro escolhido
      const ultimoLivro = document.getElementById('ultimo-livro'); // Seleciona a div do último livro sorteado
      const mensagemLivro = document.getElementById('mensagem-livro-escolhido'); // Seleciona a div da mensagem de acerto/erro
      if (livroEscolhido) livroEscolhido.classList.add('efeito-pisca'); // Aplica classe de efeito piscante no livro escolhido
      if (ultimoLivro) ultimoLivro.classList.add('efeito-pisca'); // Aplica classe de efeito piscante no último livro sorteado
      if (mensagemLivro) mensagemLivro.classList.add('efeito-pisca'); // Aplica classe de efeito piscante na mensagem de acerto/erro

      // Remover o efeito após 3 segundos
      setTimeout(function () {
        if (livroEscolhido) livroEscolhido.classList.remove('efeito-pisca');
        if (ultimoLivro) ultimoLivro.classList.remove('efeito-pisca');
        if (mensagemLivro) mensagemLivro.classList.remove('efeito-pisca');
      }, 5000); // Duração total do efeito piscante (2 segundos)
    }, 1500); // Aguardar 1.5 segundos antes de iniciar o efeito piscante
  }
}

// Função para ir para a próxima fase
function vaiParaProximaFase() {
  window.location.href = "https://www.w3schools.com";
}

// Função para sair do jogo
function sairDoJogo() {
  window.close();
}

// Adicionar evento click aos botões
window.addEventListener('DOMContentLoaded', function () {
  const botaoProximaFase = document.getElementById('proxima-fase');
  if (botaoProximaFase) {
    botaoProximaFase.addEventListener('click', vaiParaProximaFase);
  }

  const botaoSairJogoFinalizado = document.getElementById('sair-jogo-finalizado');
  if (botaoSairJogoFinalizado) {
    botaoSairJogoFinalizado.addEventListener('click', sairDoJogo);
  }
});
