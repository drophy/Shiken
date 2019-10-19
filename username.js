console.log("username.js connected");

/// GET RANDOM FACT ///
const arrFacts = [
   `Shiken (しけん or 試験) means 'test' in Japanese.`,
   `The odds of getting a royal flush are exactly 1 in 649,740.`,
   `M&M stands for Mars and Murrie.`
]

async function getUselessQuote() {
   let response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
   let json = await response.json();
   let text = json.text.replace(/`/g, `'`);
   document.querySelector("#quote p").innerHTML = text;
}

let uselessQuote = getUselessQuote()
   .catch((error) => {
      document.querySelector("#quote p").innerHTML = arrFacts[Math.floor(Math.random()*3)];
   });

/// BUTTOM LISTENER ///
document.querySelector("button").addEventListener("click", (event) => {
   // document.querySelector("input[type='text']").disabled = "disabled";
   document.querySelector("input[type='text']").setAttribute('readonly', '');
   console.log(event.target.disabled = true);
});