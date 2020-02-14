//una lista de tipo Node
var movObjs = document.getElementsByClassName('draggable');

//Esto me permite ciclar entre Node Objects
Array.prototype.forEach.call(movObjs, function(item) {
  //console.log(item);
  
  item.onmousedown = function(event) {
    
    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top;
    
    item.style.position = 'absolute';
    item.style.zIndex = 1000;
    document.body.append(item);
    
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
      //console.log(item);
    };
    
  };
  
  item.ontouchstart = function(event) {
    
    let shiftX = event.targetTouches[0].clientX - item.getBoundingClientRect().left;
    let shiftY = event.targetTouches[0].clientY - item.getBoundingClientRect().top;
    
    item.style.position = 'absolute';
    item.style.zIndex = 1000;
    document.body.append(item);
    
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
    };
    
  };
  
  item.ondragstart = function() {
      return false;
  };
  
});

