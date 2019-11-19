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

/// COUNT TIME ///
let timePassed = 0; // time in seconds
let playerAnswerTime;

for(let i = 0; i < totalTime-1; i++) {
   setTimeout(function() {
      timePassed++;
   }, 1000*i);
}

setTimeout(finish, 1000*(totalTime-1));

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