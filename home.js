/// ANIMATE LOGO ///
const logo = document.querySelectorAll("#logo>path");

for(let i = 0; i < logo.length; i++) {
   logo[i].addEventListener("animationend", (event) => event.path[0].classList.add("full-path"));
}

/// OPEN & CLOSE MODAL ///
document.querySelector('#sign-up').addEventListener("click", function(){
   document.querySelector('.modal2 h2').innerText = "Sign up";
   document.querySelector('.modal2 form button').innerText = "Sign up";
   document.querySelector('.modal-bg').classList.add('modal-bg-active');
});
document.querySelector('#log-in').addEventListener("click", function() {
   document.querySelector('.modal2 h2').innerText = "Log in";
   document.querySelector('.modal2 form button').innerText = "Log in";
   document.querySelector('.modal-bg').classList.add('modal-bg-active');
});
document.querySelector('.modal-exit').addEventListener("click", function() {
   document.querySelector('.modal-bg').classList.remove('modal-bg-active');
});

/// NAVEGATION BUTTONS ///
document.querySelector('#play-button').addEventListener("click", function() {
   location.href='username.html';
});
document.querySelector('#modal-form button').addEventListener("click", function() {
   // Login verification goes here
   
   location.href='quiz_dashboard.html';
});