console.log('voter.js connected');

/// CLASSES ///
class SleepingChick{
   constructor(im){
       this.clicks = 0;
       this.anim = 1;
       this.image = im;
   }
}

/// SOCKETS ///
const socket = io(`/`);

let answerQuantityIsKnown = false;
socket.on('answerQuantity', function(objData) {
   console.log("got answer quantity message");
   console.log(objData);

   // Check if it's a message from our game 
   if(objData.code === localStorage.code && !answerQuantityIsKnown) {
      // Enable or disable answers
      initAnswers(objData.answerQuantity);
      answerQuantityIsKnown = true; // so it won't init again if another message is received
   }
});

socket.on('next', function(objData) {
   // Check if it's a message from our game 
   if(objData.code === localStorage.code)
      if(objData.done == false) location.href='ItemScreen.html';
      else location.href = 'index.html';
});

/// CORE FUNCTIONS ///
function pickAnswer(event) {
   // Send answer
   socket.emit('answer', {code: localStorage.code, username: localStorage.username, answer:event.target.innerText});

   // Unmark all as selected
   document.querySelectorAll('.answer').forEach((answer) => {
      answer.style.boxShadow = 'none';
   });

   // Mark target as selected
   event.target.style.boxShadow = '0px 0px 10px #000000';
}

function initAnswers(answerQuantity) {
   document.querySelectorAll('.answer').forEach((answer, i) => {
      if(i+1 <= answerQuantity) {
         answer.classList.remove('disabled');
         answer.addEventListener('click', pickAnswer);
      }
   })
}

/// POWER UP FUNCTIONS ///
let container = document.getElementById("ItemDiv");
let activeItems = [false, false, false, false];
let chicks = [];
let lastChick = 0;

function initItems(){
   if(activeItems[0] == true){
      initHen();
   }
   if(activeItems[1] == true){
      initChicks();
   }
}

let HenTop = -window.innerHeight -5 ;
function initHen(){
   container.innerHTML += `
   <img src="./images/Items/hen.png" id="Hen">
   `;
   let Hen = document.getElementById("Hen");
   Hen.style.left = -10 +"px";
   
   Hen.addEventListener("click", function(){
      HenTop -= 50;
  });
   
   var HenAnim = setInterval(HenFrame, 10);
   
}

function HenFrame(){    
   let Hen = document.getElementById("Hen");

   if(HenTop >= -10){
      if(HenTop > -10){
         HenTop = -10;
      }
//         Hen.style.transform = `rotate(0)`;
   }else{
      HenTop++;
//      Hen.style.transform = `rotate(${Math.cos(HenPos)}deg)`;    
   }
   Hen.style.top = HenTop +"px";
   //console.log("increment:" +increment);
   //console.log("pos: " +HenDiv.style.left +" " +HenDiv.style.top);
}

function initChicks(){
   var ChickID = [];
   for(let i=0; i<3; i++){
      //Add to HTML
      container.innerHTML += `
       <img src="./images/Items/hen.png" id="Chick${i}" class="SleepingChick">
       `;

      //Add to array
      chicks.push(new SleepingChick(document.getElementById(`Chick${i}`)));
      
      //Rand position
      chicks[i].image.style.top = Math.floor((Math.random() * (window.innerHeight -261) ) ) +"px";
      chicks[i].image.style.left = Math.floor((Math.random() * (window.innerWidth -224) ) ) +"px";
   
      //ChickID[i] = setInterval(ChickFrame, 10);
   
   }

   for(let i=0; i<chicks.length; i++){
      document.getElementById(`Chick${i}`).addEventListener("click", function(){
         lastChick = i;
         if(chicks[i].clicks < 15){
            chicks[i].clicks++;
            console.log(chicks[i].clicks);
         }else{
            wakeUpChick(i);
         }
      });
   }
}

function ChickFrame(){    
   if(chicks[i].clicks < 15){
      if(chicks[i].anim = 20){
         chicks[i]
      }
   }   
}

function wakeUpChick(i){
   chicks[i] = undefined;
   document.querySelector(`#Chick${i}`).remove();
}

function initEgg(){
   container.innerHTML += `
   <img src="./images/Items/Egg.png" id="egg">
   `;
   let egg = document.getElementById("egg");
   egg.style.top = 0 +"px";
   egg.style.left = (window.innerWidth/4) +"px";
   EggAnim = setInterval(EggFrame, 100);
}

let eggTop = 0;
function EggFrame(){
   let egg = document.getElementById("egg");
   if(eggTop <= window.innerHeight +30){
      if(eggTop > 30) eggTop++;
      if(eggTop > 60) eggTop++;
      eggTop++;
      egg.style.top = eggTop +"px";
   }else{
      document.querySelector("#egg").remove;
      clearInterval(EggFrame);
   }
}

/// CHICKEN ANIM TEST ///
let htmlTestChicken = document.querySelector('#test-chicken');
// let degrees = 0;
// let radians;

// setInterval(() => {
//    degrees = (degrees+5)%360;
//    radians = degrees*2*Math.PI/360;

//    htmlTestChicken.style.transform = `scale(${1+0.05*Math.sin(radians)}, ${1-0.025*Math.sin(radians)})`;
// }, 42); // aprox 1000/24 to aproach 24 fps

htmlTestChicken.addEventListener('click', function(event) {
   this.src = 'images/Items/StartledChick.png';
   this.style.animationName = "wakeUp";
   this.style.animationDuration = "0.2s";
   this.style.transitionDuration = "0.2s";
   this.style.animationIterationCount = "1";
   setTimeout(() => {
      this.remove();
   }, 200);
});