//----- Reescribiendo -----

//Configuración para la sincronización entre clientes

//Syncronizacion
var room = new PubNub({
    publishKey: 'XXXX',
    subscribeKey: 'XXXX'
});

room.subscribe({
    channels: ['boardDC']
});

// Escuchar a la llegada de nuevos mensajes
room.addListener({

  message: function(message) {
    console.log(message.message);
    
      item = document.getElementById(message.message[1]);
          
      //Actualizar posicion del objeto con id
      if (message.message[0] == 'move') {
        item.style.left = message.message[2];
        item.style.top = message.message[3];
        
        //Hacemos que el nuevo objeto quede por encima de todos
        item.style.zIndex = 1000;
        document.body.append(item);
        
      //Actualizar rotación del objeto con id  
      } else if (message.message[0] == 'rotate') {
        item.style.transform = message.message[2];
        
      //Actualizar la imagen de fondo del dado con id  
      } else if (message.message[0] == 'die') {
        item.style.backgroundImage = message.message[2];        
      } else if (message.message[0] == 'eight-die') {
        item.innerHTML = message.message[2];        
      
      
      } else if (message.message[0] == 'flip') {
        
        //message.push('flip', item.id, item.classList.contains("shown"));
        if(message.message[2]) {
          item.src = "img/" + item.id + ".png";
        } else {
          item.src = "img/cover.png";
        }
      }

    

  }

});

//Enviar cualquier mensaje
function publish(message) {
  room.publish({
    message: message,
    channel: 'boardDC'
  });
};

// Evitar que se de click derecho
window.oncontextmenu = function() {
  return false;
} 

// ---Envíos---

// Envia move, id, left y top
function sendMove(item){
  var message = [];
      
  message.push('move', item.id, item.style.left, item.style.top);
        
  publish(message);
}

// Envia rotate, id y transformación
function sendRotation(item){
  var message = [];
  
  message.push('rotate', item.id, item.style.transform);
  
  publish(message);
};

// Envía die, id y background-image
function sendDieFace(item) {
  var message = [];
  
  message.push('die', item.id, item.style.backgroundImage);
  
  publish(message);
};

function sendCardFlip(item) {
  var message = [];
  
  message.push('flip', item.id, item.classList.contains("shown"));
  
  publish(message);
};

// Envía die, id y value
function sendEightDieFace(item, value) {
  var message = [];
  
  message.push('eight-die', item.id, value);
  
  publish(message);
};

// Obtiene la ruta de la imagen
function getImgSrcPath(item) {
  splitPath = item.src.split("/");
  spIndex = 0;
  path = "";
  
  for (i = 0; i < splitPath.length; i++) {
    if (splitPath[i] == "img") {
      spIndex = i;
    }
  }
  
  for (i = spIndex; i < (splitPath.length - 1); i++) {
    path = path + splitPath[i] + "/";
  }
  
  return path;
}


//Aquí están todos los objetos seleccionables
var selectableObjects = document.getElementsByClassName('selectable');

// ---Selectable---

//Pone la etiqueta selected a un objeto
function selectObject(item){
  
  //Deselecciono todo
  deselectObjects();
  
  //Selecciono el nuevo elemento
  item.classList.add("selected");
  
};

//Quita la etiqueta selected a todos los objetos seleccionables
function deselectObjects(){
  
  Array.prototype.forEach.call(selectableObjects, function(item) {
          item.classList.remove("selected");
  });

};

// ---Draggable---
function dragObject(item){
  
  document.ondragstart = function() {
      return false;
  };
  
  let shiftX = event.clientX - item.getBoundingClientRect().left;
  let shiftY = event.clientY - item.getBoundingClientRect().top;
  
  item.style.position = 'absolute';
  item.style.zIndex = 1000;
  //Esto solo se podrá ver cuando esté en funcionamiento el arastre
  document.body.append(item);
  
  function onMouseMove(event){
    item.style.left = event.pageX - shiftX + 'px';
    item.style.top = event.pageY - shiftY + 'px';
  }
  
  document.addEventListener('mousemove', onMouseMove);
  
  document.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    item.onmouseup = null;
    
    //Debemos poner el sendmove solamente una vez se termine el movimiento
    sendMove(item);
  };
  
  
};

// ---Rotate---

function rotateSelectedObject(){
  //preguntamos si es un botón
  
  document.ondragstart = function() {
      return false;
  };
  
  item = document.getElementsByClassName("selected")[0];
  //console.log(item);
  
  //Chequeo si mi objeto marcado con selected está definido
  if( item ) {
    
    // vemos si la rotación no está definida
    if( !(item.style.transform) ) {
      
      //console.log("No ha sido rotado");
      
      // Le aplicamos una rotación inicial
      item.style.transform = 'rotate(30deg)';
      
    //Si el objeto ya ha sido rotado
    } else {
      
      //Obtenemos y calculamos la rotación
      var rotation = item.style.transform;
      
      //Aqui troceamos la cadena transform y convertimos a int los grados
      rotation = parseInt(rotation.split("(")[1].split("d")[0]) + 30;
      
      //Si se sale de los 360 volvemos a empezar
      if(rotation > 360) {
        rotation = rotation - 360;
      }
      
      //aplicamos finalmente la transformación
      item.style.transform = 'rotate(' + rotation + 'deg)';
      
    }
    
  }
  
  //return item.style.transform;
};

// ---Throw die---

function throwWhiteDie(item) {
  
  value = Math.floor((Math.random() * 6) + 1);
  
  switch(value) {
        case 1:
          image = "img/wd1.png";
          break;
        case 2:
          image = "img/wd2.png";
          break;
        case 3:
          image = "img/wd3.png";
          break;
        case 4:
          image = "img/wd4.png";
          break;
        case 5:
          image = "img/wd5.png";
          break;
        case 6:
          image = "img/wd6.png";
          break;
        default:
          console.log("Falló");
  }
  
  item.style.backgroundImage = "url(" + image + ")";
  //return image;
  sendDieFace(item);
};

function throwBlackDie(item) {
  
  value = Math.floor((Math.random() * 6) + 1);
  
  switch(value) {
        case 1:
          image = "img/bd1.png";
          break;
        case 2:
          image = "img/bd2.png";
          break;
        case 3:
          image = "img/bd3.png";
          break;
        case 4:
          image = "img/bd4.png";
          break;
        case 5:
          image = "img/bd5.png";
          break;
        case 6:
          image = "img/bd6.png";
          break;
        default:
          console.log("Falló");
  }
  
  item.style.backgroundImage = "url(" + image + ")";
  //return image;
  sendDieFace(item);
};


function throwWhiteEightDie(item) {
  
  value = Math.floor((Math.random() * 8) + 1);
  
  item.innerHTML = value;
  //return image;
  sendEightDieFace(item, value);
};

function throwBlackEightDie(item) {
  
  value = Math.floor((Math.random() * 8) + 1);
  
  item.innerHTML = value;
  //return image;
  sendEightDieFace(item, value);
};

function throwColorDie(item) {
  
  value = Math.floor((Math.random() * 6) + 1);
  
  switch(value) {
        case 1:
          image = "img/yellow.png";
          break;
        case 2:
          image = "img/blue.png";
          break;
        case 3:
          image = "img/red.png";
          break;
        case 4:
          image = "img/green.png";
          break;
        case 5:
          image = "img/yellow-green.png";
          break;
        case 6:
          image = "img/red-blue.png";
          break;
        default:
          console.log("Falló");
  }
  
  item.style.backgroundImage = "url(" + image + ")";
  //return image;
  sendDieFace(item);
};

function throwDie(item) {
  
  //Obtenemos la imagen de la cara del dado segun el tipo
  if (item.classList.contains("white-die")) {
    throwWhiteDie(item);
  } else if (item.classList.contains("black-die")) {
    throwBlackDie(item);
  } else  if (item.classList.contains("white-eight-die")) {
    throwWhiteEightDie(item);
  } else if (item.classList.contains("black-eight-die")) {
    throwBlackEightDie(item);
  } else if (item.classList.contains("color-die")) {
    throwColorDie(item);
  }
  
};


//Función que determina qué hacer cuándo se hace click en peek o show
function showSelectedCard(item) {
  
  //Evitamos que el botón se arrastre
  document.ondragstart = function() {
      return false;
  };
  
  selectedItem = document.getElementsByClassName("selected")[0];
  
  if(selectedItem) {
    
    if (selectedItem.classList.contains("card")){
      
      //Buscamos obtener la ruta relativa del archivo
      path = getImgSrcPath(selectedItem);
      
      //Aquí hacemos el intercambio
      //Transcribimos lo hecho anteriormente hecho en la máquina de estado finito
      
      //Estado: shown peeked
      if (selectedItem.classList.contains("shown") && selectedItem.classList.contains("peeked")){
        
        // Para ir al estado vacío necesito quitarle shown y peeked
        if (item.classList.contains("show-button")) {
          selectedItem.classList.remove("shown");
          selectedItem.classList.remove("peeked");
          selectedItem.src = path + "cov.png";
          
          // Cuidado
          sendCardFlip(selectedItem);          
        }
        
      //Estado: peeked
      } else if (selectedItem.classList.contains("peeked")) {
        
        // Para ir al estado vacío necesito quitarle solamente peeked
        if (item.classList.contains("peek-button")) {
          selectedItem.classList.remove("peeked");
          selectedItem.src = path + "cov.png";
        
        // Para ir al estado shown peeked necesito agregarle shown
        } else if (item.classList.contains("show-button")) {
          selectedItem.classList.add("shown");
          selectedItem.src = path + selectedItem.id + ".png";
          
          // Cuidado
          sendCardFlip(selectedItem);
        }
        
      //Estado: none 
      } else {
        
        // Para ir al estado peeked necesito agregarle peeked
        if (item.classList.contains("peek-button")) {
          selectedItem.classList.add("peeked");
          selectedItem.src = path + selectedItem.id + ".png";
          
        
        // Para ir al estado shown y peeked necesito agregarle shown y peeked
        } else if (item.classList.contains("show-button")) {
          selectedItem.classList.add("shown");
          selectedItem.classList.add("peeked");
          selectedItem.src = path + selectedItem.id + ".png";
          // Cuidado
          sendCardFlip(selectedItem);
        }
        
      }
      
    }
    
  }
  
};

//Aquí determinamos que ocurre cuando interactuo con los objetos
document.onmousedown = function(event) {
  
  if (event.which == 1) {
    item = event.target;
    
    // Si es un objeto arrastrable
    if (item.classList.contains("draggable")){
      
      selectObject(item);
      dragObject(item);
    
    // Si se presiona un boton para rotar elementos  
    } else if (item.classList.contains("rotate-button")) {
      
      rotateSelectedObject();
      sendRotation(item);
    // Si se lanza un dado
    } else if (item.classList.contains("die-button")) {
      
      throwDie(item);
      //sendDieFace(item);
      
    // Si se presiona en peek o show para revelar una carta
    } else if (item.classList.contains("peek-button") || item.classList.contains("show-button")) {
      showSelectedCard(item);
    
    // Si es un objeto que no es arrastrable o accionable  
    } else {
      
      deselectObjects();
    
    }
  }
};
