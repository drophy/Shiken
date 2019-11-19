console.log("username.js connected");

/// DATA BASE ///
function getDB() {
   objGames = localStorage.objGames? JSON.parse(localStorage.objGames) : {};
}

function updateDB() {
   localStorage.objGames = JSON.stringify(objGames);
}

let objGames;

/// GET RANDOM FACT ///
const arrFacts = [
   `Shiken (しけん or 試験) means 'test' in Japanese.`,
   `The odds of getting a royal flush are exactly 1 in 649,740.`,
   `M&M stands for Mars and Murrie.`
]

function getLocalFact() {
   document.querySelector("#quote p").innerHTML = arrFacts[Math.floor(Math.random()*3)];
}

async function getUselessFact() {
   // Fetch, extract and parse fact
   let response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
   let json = await response.json();
   let text = json.text.replace(/`/g, `'`);

   // Filter some... inappriopriate facts
   if(text.includes("masturbation") || text.includes("penis") || text.includes("orgasm")) getLocalFact();
   else document.querySelector("#quote p").innerHTML = text;
}

getUselessFact()
   .catch((error) => getLocalFact());

/// ENTER USERNAME ///
document.querySelector("button").addEventListener("click", (event) => {
   let htmlInput = document.querySelector("input[type='text']")
   let desiredUsername = htmlInput.value;
   
   // Validate it's an unique username
   getDB();
   objGames[localStorage.code].players.forEach((objPlayer) => {
      if(objPlayer.username == desiredUsername) {
         // Let user know the username is taken
         document.querySelector('form p').style.visibility = 'visible';
         return;
      }
   });

   // Save it to the DB
   objGames[localStorage.code].players.push({username: desiredUsername, points: 0});
   updateDB();

   // Save locally so we can assign points to them
   localStorage.username = desiredUsername;

   // Disable input and button
   htmlInput.setAttribute('readonly', '');
   event.target.disabled = true;
});


/// START GAME (temp) ///
// setTimeout(function() {
//    location.href='game.html';
// }, 10000);