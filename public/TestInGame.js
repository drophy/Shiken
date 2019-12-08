//Sacar de la database
let currentReactive = new Reactive(
    "Which of the following is the religious leader of Buddhism in Gensokyo?",
    ["Toyosatomimi No Miko",
    "Byakuren Hijiri",
    "Kanako Yasaka",
    "Marisa Kirisame"],
    "https://en.touhouwiki.net/images/8/87/ThGKPartI.png",
    [1]
);
currentReactive.time = 30;
//currentReactive.imgHidden = true;

let time = currentReactive.time;
let clock = document.getElementById("clk");
let answers = document.getElementById("Answers");
let question = document.getElementById("Question");

let paused = false;

function init(){
    if(currentReactive.imgHidden == false){
        question.innerHTML += `
        <img id="QImg" src="${currentReactive.URL}">
        `
        let img = document.getElementById("QImg");
        img.onerror = function(){
            console.log("Image not found, using default one");
            qImg.src = "https://img2.gelbooru.com//images/9f/82/9f8218c9ac57e950f4b7bee129379347.jpg";    
        }
    }
    question.innerHTML += `
    <p id ="QText">${currentReactive.Question}</p>
    `
    
    count();
    clock.value = time;

    for(let i=0; i<4; i++){
        if(currentReactive.Answers[i] != undefined){
            answers.innerHTML += `
            <div class="answer" id="A${i}">${String.fromCharCode(65 + i)}) ${currentReactive.Answers[i]}</div>
            `;
        }
    }

}

function count(){
        setTimeout(function(){
            reduceTimer();
        }, 1_000);
}
function reduceTimer(){
    if(time == 0){
        location.replace("ItemScreen.html");
    }else if(!paused){
        time--;
        clock.value = time;
    }
    count();
}

init();