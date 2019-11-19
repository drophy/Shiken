console.log('standings2.js connected');

/// HTML ELEMENTS ///
let htmlCardContainer = document.querySelector('#card-container');
let htmlBottomContainer = document.querySelector('#bottom-container');

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
   players: [{username: 'QuantumSerenate', points: '0'}, {username: 'drophy', points: '0'}, {username: 'MellowNight', points: '0'}]
}

/// DISPLAY USERS /// 
game.players.forEach((objPlayer) => {
   let htmlCard = `
      <div class="card">
         <span>${objPlayer.username}</span>
         <span>${objPlayer.points} pts</span>
      </div>
   `
   htmlCardContainer.insertAdjacentHTML('beforeEnd', htmlCard);
});

/// DEFINE BEHAVIOUR BY GAME-STATE ///
if(!localStorage.gameState) localStorage.gameState = 0; // states: start (0), mid game (1), end (2)

if(localStorage.gameState == 0) // game's start (state 1)
{
   htmlBottomContainer.innerHTML = `
      <button>Start</button>
   `;
   htmlBottomContainer.querySelector('button').addEventListener('click', function(event) {
      // Go to first question
      localStorage.questionIndex = 0; // 0 based index that keeps track of the current question
      localStorage.gameState = 1;
      //    location.href='hostGame.html';
   });
} else if (localStorage.gameState == 1) // mid game (state 0)
{
   localStorage.questionIndex++;
   htmlBottomContainer.innerHTML = ``;
   
   // Wait for the right number of seconds
   let waitDuration = game.Reactives[localStorage.questionIndex].time;
   setTimeout(function() {
      console.log('done waiting!'); // DBUG
   }, 1000*waitDuration);

   // If last question, change game state = 2 for the next time this page loads
   if(localStorage.questionIndex == game.Reactives.length-1)
      localStorage.gameState = 2;

   // Go to next question
   //    location.href='hostGame.html';
}
else // end of game (state 2)
{
   htmlBottomContainer.innerHTML = `
      <button>Finish</button>
   `;
   htmlBottomContainer.querySelector('button').addEventListener('click', function(event) {
      // Go back to dashboard
      localStorage.gameState = 0;
      location.href='quiz_dashboard.html';
   });
}