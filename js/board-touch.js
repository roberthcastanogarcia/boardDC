//una lista de tipo Node
var movObjs = document.getElementsByClassName('draggable');
var selObjs = document.getElementsByClassName('selectable');

//Syncronizacion
var sala = new PubNub({
    publishKey: 'XXXX',
    subscribeKey: 'XXXX'
});

// Subscribirse
sala.addListener({
    message: function(message) {
      
        //Aprovechamos la existencia de movObjs ya que no deja cargar desde el id
        for(i = 0; i < movObjs.length; i++) {
          if (movObjs[i].id == message.message[0]) {
            movObjs[i].style.left = message.message[1];
            movObjs[i].style.top = message.message[2];
            
          }
        }
        
    }
})

sala.subscribe({
    channels: ['boardDC']
});


//Seleccionar un objeto selectable
document.onmousedown = function(event) {
    
    //Si se presiona algo que no es un objeto arrastrable 
    //preguntamos si es un botón
    if(event.target.className == "button") {
      
      //Cuándo se implementen mas botones se cambiará esto por varios if
      //console.log(event.target.id);
            
      //Chequeo si mi objeto no está definido
      if( !(document.getElementsByClassName("selected")[0]) ){
        console.log("No está definido");
      } else {
        
        // vemos si la rotación no está definida
        if( !(document.getElementsByClassName("selected")[0].style.transform) ){
          
          console.log("No ha sido rotado");
          document.getElementsByClassName("selected")[0].style.transform = "rotate(90deg)";
        
        } else {
          
          //Obtenemos y calculamos la rotación
          var rotation = document.getElementsByClassName("selected")[0].style.transform;
          //Aqui troceamos y convertimos a Int los grados
          rotation = parseInt(rotation.split("(")[1].split("d")[0]) + 90;
          
          if(rotation > 360) {
            rotation = rotation - 360;
          }
          //console.log(rotation);
          
          //aplicamos finalmente la transformación
          document.getElementsByClassName("selected")[0].style.transform = 'rotate(' + rotation + 'deg)';
          
        }
      }
    } else {
      
      //Aquí debemos comprobar que el elemento a seleccionar no sea Undefined
      if( !(document.getElementsByClassName("selected")[0]) ){
        console.log("No está definido");
        
        if(event.target.classList.contains("selectable")) {
          event.target.classList.add("selected");
        }
        
      } else {
      
        Array.prototype.forEach.call(selObjs, function(item) {
          item.classList.remove("selected");
        });
          
        if(event.target.classList.contains("selectable")) {
          event.target.classList.add("selected");
        }
      
      }
      
    }
};

//Seleccionar un objeto selectable version touch
document.ontouchstart = function(event) {
    
    
    console.log(event.targetTouches[0].classList.contains("selectable"));
    //event.classList.remove("selected");
    
    Array.prototype.forEach.call(selObjs, function(item) {
        item.classList.remove("selected");
        item.classList.remove("selected");
    });
      
    if(event.toElement.classList.contains("selectable")) {
      event.toElement.classList.add("selected");
    }
    
    
};


//Esto me permite ciclar entre Node Objects
Array.prototype.forEach.call(movObjs, function(item) {
  //console.log(item);
  
  item.onmousedown = function(event) {
    
    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;
    
    item.style.position = 'absolute';
    item.style.zIndex = 1000;
    document.body.append(item);
    
    //cambiar aqui la etiqueta de selected
    //item.classList.add("selected");
    
    moveAt(event.pageX, event.pageY);
    
    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + 'px';
      item.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    
    item.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      item.onmouseup = null;
      
      //Despues de soltar sincronizamos
      //Tuve que meter todo en un mismo archivo ya que el evento onmousedown ya estaba ocupado
      var move = [];
      
      move.push(item.id, item.style.left, item.style.top);
            
      sala.publish({
        message: move,
        channel: 'boardDC'
      });
    };
    
  };
  
  item.ontouchstart = function(event) {
    
    let shiftX = event.targetTouches[0].clientX - item.getBoundingClientRect().left;
    let shiftY = event.targetTouches[0].clientY - item.getBoundingClientRect().top;
    
    item.style.position = 'absolute';
    item.style.zIndex = 1000;
    document.body.append(item);
    
    //cambiar aqui la etiqueta de selected
    item.classList.add("selected");
    
    moveAt(parseInt(event.targetTouches[0].clientX), parseInt(event.targetTouches[0].clientY));
    
    function moveAt(pageX, pageY) {
      item.style.left = pageX - shiftX + 'px';
      item.style.top = pageY - shiftY + 'px';
    }
    
    function onTouchMove(event) {
      moveAt(parseInt(event.targetTouches[0].clientX), parseInt(event.targetTouches[0].clientY));
    }
    
    document.addEventListener('touchmove', onTouchMove);
    
    item.ontouchend = function() {
      document.removeEventListener('touchmove', onTouchMove);
      item.ontouchend = null;
      
      //Despues de soltar sincronizamos
      //Tuve que meter todo en un mismo archivo ya que el evento onmousedown ya estaba ocupado
      var move = [];
      
      move.push(item.id, item.style.left, item.style.top);
            
      sala.publish({
        message: move,
        channel: 'boardDC'
      });
      
    };
    
  };
  
  item.ondragstart = function() {
      return false;
  };
  
});

