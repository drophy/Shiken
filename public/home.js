/// DATA BASE ///
/*
function getDB() {
   objGames = localStorage.objGames? JSON.parse(localStorage.objGames) : {};
   objPasswords = localStorage.objPasswords? JSON.parse(localStorage.objPasswords) : {};
}

function updateDB() {
   localStorage.objGames = JSON.stringify(objGames);
   localStorage.objPasswords = JSON.stringify(objPasswords);
}

let objGames, objPasswords;
getDB();
*/

let objGames = {
   '1234': {
      title: 'quantum physics quiz',
      date: '2019-11-17',
      arrQuestions: [],
      arrAnswers: [[], [], []]
      // etc.
   }
}

let objPasswords = {
   'drophy@gmail.com': 'holi'
}

/// LOCAL STORAGE ///
// Note: keys and values for local storage must be strings :o
// Consider using localStorage.isLoggedIn to automatically take you to the host dashboard until you log out

// If user is logged in, they shouldn't see this screen
if(localStorage.token) location.href='quiz_dashboard.html';

/// HTML ELEMENTS ///
let htmlModalForm = document.querySelector('#modal-form');
let htmlEmailInput = document.querySelector('#modal-form input[type=email]');
let htmlPasswordInput = document.querySelector('#modal-form input[type=password]');
let htmlModalButton = document.querySelector('#modal-form button');
let htmlModalText = document.querySelector('#modal-form p');

/// ANIMATE LOGO ///
const logo = document.querySelectorAll("#logo>path");

for(let i = 0; i < logo.length; i++) {
   logo[i].addEventListener("animationend", (event) => event.path[0].classList.add("full-path"));
}

/// OPEN & CLOSE MODAL ///
let isSigningUp = false;

document.querySelector('#sign-up').addEventListener("click", function(){
   document.querySelector('.modal2 h2').innerText = "Sign up";
   document.querySelector('.modal2 form button').innerText = "Sign up";
   document.querySelector('.modal-bg').classList.add('modal-bg-active');
   isSigningUp = true;
});
document.querySelector('#log-in').addEventListener("click", function() {
   document.querySelector('.modal2 h2').innerText = "Log in";
   document.querySelector('.modal2 form button').innerText = "Log in";
   document.querySelector('.modal-bg').classList.add('modal-bg-active');
   isSigningUp = false;
});
document.querySelector('.modal-exit').addEventListener("click", function() {
   htmlModalText.innerText = '';
   document.querySelector('.modal-bg').classList.remove('modal-bg-active');
});

/// NAVEGATION BUTTONS ///

// Validate game code
document.querySelector('#play-button').addEventListener("click", async function() {
   let code = document.querySelector('#code-input').value;

   let response = await fetch(`/game/isvalidcode?code=${code}`, {method: 'GET'});
   let objResponse = await response.json();
   if(objResponse.valid) {
      localStorage.code = code;
      location.href='username.html';
   }
   else document.querySelector('#content p').style.visibility = 'visible';
});

// Disable sign up / log in if form is invalid
htmlModalForm.addEventListener('input', function(e) {
   let htmlInvalidInputs = htmlModalForm.querySelectorAll('input:invalid');
   htmlModalButton.disabled = htmlInvalidInputs.length > 0;

   if(htmlModalButton.disabled) htmlModalButton.classList.add('disabled-button');
   else htmlModalButton.classList.remove('disabled-button');
});

 

// Validate sign up / log in
document.querySelector('#modal-form button').addEventListener("click", async function() {
   let email = htmlEmailInput.value;
   let password = htmlPasswordInput.value;
   
   if(isSigningUp)
   {
      // Validate it's a new email
      try {
         //Localhost:3000 luego lo cambiamos por el link de Heroku
         let response = await fetch(`/user/${email}`, { method: 'GET' });
         let objResponse = await response.json();

         console.log(objResponse.EmailExists);

         if(objResponse.EmailExists == true) {
            htmlModalText.innerText = 'Oops! It seems like a user with this email already exists!';
         } else {            
            // Save user in DB
            response = await fetch('/users', {
               method: 'POST',
               headers: {'content-type':'application/json'},
               body: JSON.stringify({'id': objResponse.id, 'email': email, 'password': password})
            });
            objResponse = await response.json();
            localStorage.token = objResponse.token;
            location.href='quiz_dashboard.html'; // let them in
         }
      } catch(error) {
         console.log(error);
         alert("Sorry! There seems to be a problem with our DB at the moment");
         return;
      }
   }
   else
   {

      try {
         let response = await fetch(`/password/${email}/${password}`, { method: 'GET' });
         let objResponse = await response.json();

         console.log(objResponse.id);

         if(objResponse.id == "-1") {
            htmlModalText.innerText = 'Oops! Please verify the email and password are correct';
         } else {
            localStorage.token = objResponse.token;
            location.href='quiz_dashboard.html'; // let them in!
           
         }
      } catch(error) {
         console.log(error);
         alert("Sorry! There seems to be a problem with our DB at the moment");
         return;
      }
   }
});