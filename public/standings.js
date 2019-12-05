/// MAIN ///
console.log("standings.js connected");

nextColor = 0;
arrColors = [
   'rgba(255, 99, 132)',
   'rgba(54, 162, 235)',
   'rgba(255, 206, 86)',
   'rgba(75, 192, 192)',
   'rgba(153, 102, 255)',
   'rgba(255, 159, 64)'
];

render();

/// FUNCTIONS ///
async function getGraphData() {
   const response = await fetch("assets/standings.csv");
   const strCSV = await response.text();

   let rows = strCSV.trim().split('\n');

   let labels = rows[0].split(',');
   rows = rows.slice(1); // we'll remove the labels from our data

   rows = rows.map(row => row.split(','));

   return {labels, rows};
}

function genDataSet(row) {
   console.log(row);
   let username = row.splice(0, 1, '0'); // we replace the username at row[0] for 0 (points)
   return {
      label: username,
      data: row,
      borderColor: arrColors[nextColor++ % arrColors.length],
      fill: false,
      borderWidth: 1
   }
}

async function render()
{
   let graphData = await getGraphData().catch(error => console.log("Could not load CSV :c"));
   graphData.labels.splice(0, 1, "start"); // replace "username" for "start"
   let datasets = [];
   graphData.rows.forEach((row) => datasets.push(genDataSet(row)));

   const ctx = document.getElementById('myChart').getContext('2d');
   const myChart = new Chart(ctx, {
      type: 'line',
      data: {
         labels: graphData.labels,
         datasets: datasets,
      },
      options: {
         elements: {
            line: {
               tension: 0 // disables bezier curves for faster rendering
            }
         },
         scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true
                  }
               }]
         }
      }
   });
}