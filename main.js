/// ANIMATE LOGO ///
const logo = document.querySelectorAll("#logo>path");

for(let i = 0; i < logo.length; i++) {
   logo[i].addEventListener("animationend", (event) => event.path[0].classList.add("full-path"));
}

/// OPEN & CLOSE MODAL ///
document.querySelector('.nav-link').addEventListener("click", function(){
   document.querySelector('.modal-bg').classList.add('modal-bg-active');
});
document.querySelector('.modal-exit').addEventListener("click", function() {
   document.querySelector('.modal-bg').classList.remove('modal-bg-active');
});