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
if(!currentReactive) {
    alert('Failed to load the first question. Please make sure you edited and saved your quiz first!');
}
let answerQuantity = currentReactive.Answers.length;

/// SOCKET CONNECTION ///
const socket = io(`/`);

socket.emit('answerQuantity', {code: localStorage.gameId, answerQuantity: answerQuantity});
for(let i = 1; i <= 3; i++) {
    setTimeout(() => {
        socket.emit('answerQuantity', {code: localStorage.gameId, answerQuantity: answerQuantity});
    }, 500*i); // the message is sent again after .5, 1 and 1.5 seconds
}

socket.on('answer', function(objData) {
    // Check if it's a user from this game 
    if(objData.code === localStorage.gameId) {
       saveAnswer(objData);
    }
 });

// Set variables with question's data
let time = currentReactive.time; // we'll decrease this one
const totalTime = currentReactive.time; // this one is just for readability
let clock = document.getElementById("clk");
let answers = document.getElementById("Answers");
let question = document.getElementById("Question");

let paused = false;

// Fill with Reactive's data
function init(){
    if(currentReactive.imgHidden == false)
    {
        question.innerHTML += `<img id="QImg" src="${currentReactive.URL || 'images/imageNotFound.png'}">`
    }
    question.innerHTML += `<p id ="QText">${currentReactive.Question}</p>`;

    for(let i=0; i<4; i++){
        if(currentReactive.Answers[i] != undefined){
            answers.innerHTML += `
            <div class="answer" id="A${i}">${String.fromCharCode(65 + i)}) ${currentReactive.Answers[i]}</div>
            `;
        }
    }

    // Start counting time
    clock.value = time;
    count();
}

init();

/// FUNCTIONS ///
let arrAnswers = [];

// Adds a time stamp and adds it to array
function saveAnswer(objAnswer) {
    // Create timestamp
    objAnswer.pastTime = totalTime - time;

    // Parse answer
    objAnswer.answer = objAnswer.answer.charCodeAt(0) - 65; // Maps 'A' to 0, 'B' to 1, etc.

    // If the user had already submitted an answer, replace it
    for(let i = 0; i < arrAnswers.length; i++) {
        if(arrAnswers[i].username === objAnswer.username) {
            arrAnswers[i] = objAnswer;
            return;
        }
    }

    // Else, just add it
    arrAnswers.push(objAnswer);
}

let arrAnswerVotes = [0, 0, 0, 0];
arrAnswerVotes.splice(answerQuantity);

// Counts how many people voted for each and gives points if they were right
function evaluateAnswers() {
    arrAnswers.forEach(objAnswer => {
        arrAnswerVotes[objAnswer.answer]++;

        // If answer is correct, we give the user points
        if(currentReactive.correct[objAnswer.answer] == true)
        {
            let points = 100 - 40*(objAnswer.pastTime/totalTime);
            points = Math.ceil(points);
            objGame.Players.forEach(player => {
                if(player.username === objAnswer.username) player.points = Number(player.points) + points;
            });
        }
    });
}

function count(){
    setTimeout(function(){
        reduceTimer();
    }, 1_000);
}

function reduceTimer(){
    if(time == 0){
        // Evaluate answers and give points
        evaluateAnswers();
        updateGame();

        // Save the amount of votes each answer had
        localStorage.arrAnswerVotes = JSON.stringify(arrAnswerVotes);

        // Tell the players to move to the next screen too
        socket.emit('next', {code: localStorage.gameId, done: localStorage.gameState == 2});
        location.replace("answers.html");
    }else if(!paused){
        time--;
        clock.value = time;
    }
    count();
}