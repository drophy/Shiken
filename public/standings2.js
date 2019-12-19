console.log('standings2.js connected');

/// CONSTANTS ///
const WAIT_DURATION = 10; // seconds

/// HTML ELEMENTS ///
let htmlCardContainer = document.querySelector('#card-container');
let htmlBottomContainer = document.querySelector('#bottom-container');

/// LOCAL STORAGE ///
let objGame;

function loadGame() {
   objGame = localStorage.objGame? JSON.parse(localStorage.objGame) : {Players:[]};
}
function updateGame() {
   localStorage.objGame = JSON.stringify(objGame);
}

loadGame();

/// SOCKET CONNECTION ///
const socket = io(`/`);

socket.on('newUser', function(objData) {
   // Check if it's a user from this game 
   if(objData.code === localStorage.gameId) {
      // If so, add them to the lobby
      let htmlCard = `
      <div class="card">
         <span>${objData.username}</span>
         <span>0 pts</span>
      </div>
      `
      htmlCardContainer.insertAdjacentHTML('beforeEnd', htmlCard);
   }
});

/// DISPLAY USERS /// 
objGame.Players.sort((playerA, playerB) => {
   return   playerA.points > playerB.points? 1 :
            playerB.points > playerA.points? -1 :
            0;
});

objGame.Players.forEach((objPlayer) => {
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
// IMPORTANT: Not to be confused with the State property which is stored in each object the DB
// and indicates if the game is joinable (1) or not (0)

if(localStorage.gameState == 0) // game's start (state 0)
{
   document.querySelector('h1').innerText = `CODE: ${localStorage.gameId}`;
   htmlBottomContainer.innerHTML = `<button>Start</button>`;
   htmlBottomContainer.querySelector('button').addEventListener('click', async function(event) {
      // Request game object from DB and save it locally
      let response = await fetch(`/startgame/${localStorage.gameId.split('-')[1]}`, {
         method: 'GET',
         headers: {'content-type':'application/json', 'x-auth':localStorage.token}
      });
      let objResponse = await response.json();

      objGame = objResponse;
      updateGame();

      // Go to first question
      localStorage.questionIndex = 0; // 0 based index that keeps track of the current question
      socket.emit(`next`, {code: localStorage.gameId}); // tell players to move to their next screen
      if(localStorage.questionIndex == objGame.Reactives.length-1) localStorage.gameState = 2; // finish screen
      else localStorage.gameState = 1; // mid-game standings
      location.href='TestInGame.html'; // go to our next screen
   });
} 
else if (localStorage.gameState == 1) // mid game (state 1)
{
   localStorage.questionIndex++;
   document.querySelector('h1').innerText = `Standings`;
   htmlBottomContainer.innerHTML = ``;
   
   // If last question is next, change game state = 2 for the next time this page loads
   if(localStorage.questionIndex == objGame.Reactives.length-1) {
      localStorage.gameState = 2;
   }

   // Wait a bit so users can see standings and user powers
   setTimeout(function() {
      // Tell the players to move to the next screen
      socket.emit(`next`, {code: localStorage.gameId});

      // Then go to next question
      location.href='TestInGame.html';
   }, 1000*WAIT_DURATION);
}
else // end of game (state 2)
{
   htmlBottomContainer.innerHTML = `
      <button>Finish</button>
   `;
   htmlBottomContainer.querySelector('button').addEventListener('click', async function(event) {      
      // Go back to dashboard
      localStorage.gameState = 0;
      location.href='quiz_dashboard.html';
   });
}