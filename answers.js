/// INITIAL DATA ///
let arrAnswerVotes = [12, 19, 3, 7];
let arrIsCorrect = [true, false, false, true];

/// MAIN ///
generateChart(arrAnswerVotes, arrIsCorrect);

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