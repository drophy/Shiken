/// PARAMETERS ///
const WAIT_DURATION = 5; // seconds

/// LOCAL STORAGE ///
let objGame;

function loadGame() {
   objGame = localStorage.objGame? JSON.parse(localStorage.objGame) : {Players:[]};
}
function updateGame() {
   localStorage.objGame = JSON.stringify(objGame);
}

loadGame();

let currentReactive = objGame.Reactives[localStorage.questionIndex];

/// INITIAL DATA ///
console.log(localStorage.arrAnswerVotes);
let arrAnswerVotes = JSON.parse(localStorage.arrAnswerVotes);
console.log(arrAnswerVotes); // dbug
const arrIsCorrect = currentReactive.correct;

/// MAIN ///
generateChart(arrAnswerVotes, arrIsCorrect);

setTimeout(() => {
   location.href = 'standings2.html';
}, 1000*WAIT_DURATION);

/// FUNCTIONS ///
function generateChart(arrAnswerVotes, arrIsCorrect) {
   let arrLabels = ['A', 'B', 'C', 'D'];
   arrLabels.splice(arrAnswerVotes.length);
   let arrBackgroundColors = [];
   let arrBorderColors = [];

   arrIsCorrect.forEach(isCorrect => {
      if(isCorrect) {
         arrBackgroundColors.push('rgba(9, 208, 121, 0.2)');
         arrBorderColors.push('rgb(9, 208, 121)');
      }
      else {
         arrBackgroundColors.push('rgba(255, 99, 132, 0.2)');
         arrBorderColors.push('rgb(255, 99, 132)'); // or 'rgb(245, 102, 102)' which is red (error shiken)
      }
   });

   let ctx = document.getElementById('myChart').getContext('2d');
   let myChart = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: arrLabels,
         datasets: [{
               data: arrAnswerVotes,
               backgroundColor: arrBackgroundColors,
               borderColor: arrBorderColors,
               borderWidth: 1
         }]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         legend: {
            display: false
         },
         scales: {
            yAxes: [{
               ticks: {
                  beginAtZero: true,
                  fontSize: 25
               }
            }],
            xAxes: [{
               ticks: {fontSize: 30}
            }]
         }
      }
   });
}