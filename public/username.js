console.log("username.js connected");

/// SOCKET CONNECTION ///
const socket = io(`/`);

socket.on('next', function(objData) {
   // Check if it's a message from our game 
   if(objData.code === localStorage.code) {
      location.href='voter.html';
   }
});

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
   if(text.includes("masturbation") || text.includes("penis") || text.includes("ejaculation") || text.includes("orgasm")) 
      getLocalFact();
   else document.querySelector("#quote p").innerHTML = text;
}

getUselessFact()
   .catch((error) => getLocalFact());

/// ENTER USERNAME ///
document.querySelector("button").addEventListener("click", async function(event) {
   let htmlInput = document.querySelector("input[type='text']")
   let desiredUsername = htmlInput.value;

   // Try to add it to the BD
   let response = await fetch(`/newplayer?code=${localStorage.code}`, {
      method: 'PUT',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({'username': desiredUsername, 'points': 0})
   });

   let objResponse = await response.json();

   // If the username was taken...
   if(!objResponse.valid) {
      // Let user know the username is taken
      document.querySelector('form p').style.visibility = 'visible';
      return;
   } else {
      document.querySelector('form p').style.visibility = 'hidden';
   }

   // Notify host that there's a new user
   socket.emit(`newUser`, {code: localStorage.code, username: desiredUsername});

   // Save locally so we can assign points to them
   localStorage.username = desiredUsername;

   // Disable input and button
   htmlInput.setAttribute('readonly', '');
   event.target.disabled = true;
});