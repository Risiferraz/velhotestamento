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

//Funções a serem implementadas:
//1. Ao entrar nessa página (novo nível do jogo) deve surgir na div "boxdrag" a imagem do livro que será parte da div class="draggable" que foi enviada ao ser depositada na área correspondente no outro nível do jogo (nesse caso = velho testamento)
//Ao arrastar esse elemento dragável, esse deverá ser depositado no local adequado
//2. Caso seja depositado no local correto, a imagem deverá preencher todo o espaço da div "box", passar a opacidade para 1 e receber borda para destaque, e aparecer a imagem de ok acertou! Também deve perder a característica "dragável" para que fique ali definitivamente e não possa mais ser movida dali. Também deverá conduzir o jogado ao primeiro nível do jogo para o próximo livro.
//3. Caso seja depositado em local incorreto, a imagem deverá preencher todo o espaço da div "box", mas manter a opacidade em 0.2, e manter a capacidade de ser reposicionada continuando "dragável". Também deverá aparecer mensagem de erro (imagem = /imagens/tryagain)
//4. No Caso dos livros apócrifos, ao serem depositados em local inadequado, deverá ocorrer o mesmo acima, no caso de serem depositados na div "boxapocrifos" a função deverá rotacionar a imagem em 90º sentido horário; a imagem deverá preencher 100% da área do box e receber opacidade 1 (100%) e demais características conforme acima (item 2).
//5. Quanto à pontuação, pensei o seguinte:
// cada vez que for depositado em local errado perde 1 ponto
// cada vez que for depositado em local certo ganha um ponto
// 6. Ao ser depositado a imagem do livro em local certo, deverá voltar ao nível 1 para reiniciar o processo.