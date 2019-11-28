class SleepingChick{
   constructor(im){
       this.clicks = 0;
       this.anim = 1;
       this.image = im;
   }
}

console.log('voter.js connected');

/// DATA BASE ///
/*
function getDB() {
   objGames = localStorage.objGames? JSON.parse(localStorage.objGames) : {};
}

function updateDB() {
   localStorage.objGames = JSON.stringify(objGames);
}

let objGames;
getDB();
let game = objGames[localStorage.code];
*/
let game = {
   players: {'QuantumSerenate': '321', 'drophy':'444'}
}
let username = 'drophy'; // get from local storage
let answerQuantity = 2;
let correctAnswer = 'A';
let totalTime = 10;

let container = document.getElementById("ItemDiv");
let activeItems = [false, false, false, false];
let chicks = [];
let lastChick = 0;

/// COUNT TIME ///
let timePassed = 0; // time in seconds
let playerAnswerTime;

for(let i = 0; i < totalTime-1; i++) {
   setTimeout(function() {
      timePassed++;
   }, 1000*i);
}

//setTimeout(finish, 1000*(totalTime-1));

/// ENABLE / DISABLE ANSWERS ///
let points;
initAnswers(answerQuantity);

/// FUNCTIONS ///
function pickAnswer(event) {
   // Save time-stamp
   playerAnswerTime = timePassed;

   // Unmark all as selected
   document.querySelectorAll('.answer').forEach((answer) => {
      answer.style.boxShadow = 'none';
   });

   // Mark target as selected
   event.target.style.boxShadow = '0px 0px 10px #000000';

   // If correct, calculate points
   points = event.target.innerText == correctAnswer? 100 - 50*(timePassed/totalTime) : 0;
   // console.log(points); // DBUG
}

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
       <img src="https://github.com/drophy/Shiken/blob/master/images/Items/SleepingChick.png?raw=true" id="Chick${i}" class="SleepingChick">
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


function initAnswers(answerQuantity) {
   document.querySelectorAll('.answer').forEach((answer, i) => {
      if(i+1 <= answerQuantity) {
         answer.addEventListener('click', pickAnswer);
      } else {
         answer.style.backgroundColor = 'rgb(188, 187, 189)';
      }
   })
}

function finish() {
   // Save points to DB
   game.players[username] = Number(game.players[username]) + points;

   // Go to powers screen
   location.href='ItemScreen.html';
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