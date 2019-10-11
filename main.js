const logo = document.querySelectorAll("#logo>path");

for(let i = 0; i < logo.length; i++)
{
   console.log(`Letter ${i} has length ${logo[i].getTotalLength()}`)
   logo[i].addEventListener("animationend", (event) => event.path[0].classList.add("full-path"));
}