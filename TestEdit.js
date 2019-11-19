"use strict"

//Data hentai
class Reactive{
    constructor(Question, Answers, URL, correct){
        this.Question = Question;  
        this.Answers = [];
        for(let i=0; i<Answers.length; i++){
            if(Answers[i]!=undefined) this.Answers.push(Answers[i]);
        }
        this.URL = URL;
        this.correct = [];
        for(let i=0; i<this.Answers.length; i++){
            this.correct.push(false);
        }
        this.time = 20;
        this.imgHidden = false;
    }
}

class Game{
    constructor(R, N, I){
        this.Reactives = R;
        this.Name = N;
        let d = new Date();
        this.date = d.getDate; 
        this.items = I;
    }
}

//Dummy data
var R1 = new Reactive(
    "Which of the following is the religious leader of Buddhism in Gensokyo?",
    ["Toyosatomimi No Miko",
    "Byakuren Hijiri",
    "Kanako Yasaka",
    "Marisa Kirisame"],
    "https://en.touhouwiki.net/images/8/87/ThGKPartI.png",
    [1]
);
var R2 = new Reactive(
    "Who was the moderator in Hieda no Akyuu's Symposium",
    ["Kirisame Marisa",
    "Hakurei Reimu",
    "Hieda no Akyuu",
    undefined],
    undefined,
    [0]
);
var R3 = new Reactive(
    "Who participated in the Guerrilla Concerts?",
    [undefined,
    "Kasodani Kyouko",
    undefined,
    "Mystia Lorelei"],
    "https://en.touhouwiki.net/images/e/e0/ThGK_Bunbunmaru1.jpg",
    [1, 3]
);
var R4 = new Reactive(
    "Which species of Tengu prevents Kanako from building the tramway to the Youkai Mountain's top?",
    ["Crow Tengu",
    "Gray Wolf Tengu",
    "White Wolf Tengu",
    "Marisa Kirisame, not the Tengu"],
    "https://en.touhouwiki.net/images/7/72/ThGK_Bunbunmaru6.jpg",
    [2]
);

var Reactives = [R1, R2, R3, R4];

//Manejo de páginas
var currentPage = 0;

var leftArrow = document.getElementById("leftArrow");
var pageIn = document.getElementById("pageIn");
var rightArrow = document.getElementById("rightArrow");
var reactiveManager = document.getElementById("reactiveManager");
var addReactive = document.getElementById("addReactive");
var deleteReactive = document.getElementById("deleteReactive");

//Question Div
var qImg = document.getElementById("QImg");
var qText = document.getElementById("QText")
var divAns = document.getElementById("Answers");
var toggleImg = document.getElementById("toggleImg");
let currDiv;

//Footer
var del = document.getElementById("minusBtn");
var add = document.getElementById("plusBtn");
var AnswerDiv = document.getElementsByClassName("Answer");

let currKid = 0; //Unimplemented

//Answer div
var ansA = document.getElementsByClassName("Answer");
var ansSave = document.getElementById("saveBtn");
var ansText = document.getElementById("AnswerInput");

var urlBtn = document.getElementById("ImageUrlSet");
var clkBtn = document.getElementById("clkBtn");

var exit = document.getElementById("finalSave");


exit.addEventListener("click", function(){
    let items = document.getElementsByClassName("Item");
    let itemsIn = []
    for(let i=0; i<items.length; i++){
        if(items.checked) itemsIn.push(true);
        else itemsIn.push(false);
    }
    
    let game = new Game(
        Reactives,
        document.getElementById("gameName"),
        itemsIn,
        );

    console.log(JSON.stringify(game));
    
});


deleteReactive.addEventListener("click", function(){
    Reactives.pop();
    currentPage--;
    update();
});

addReactive.addEventListener("click", function(){
    if(currentPage+1 > 19) return;
    let newR = new Reactive(
        "Which one came first? \n The chicken or the egg?",
        ["Chicken",
        "Egg",
        undefined,
        undefined],
        undefined,
        []
    );
    Reactives.push(newR);
    currentPage++;
    update();
});

toggleImg.addEventListener("click", function(){
    Reactives[currentPage].imgHidden = !Reactives[currentPage].imgHidden;
    update();
});

urlBtn.addEventListener("click", function(){
    Reactives[currentPage].URL = document.getElementById("UrlIn").value;
    update();
});

qText.addEventListener("keyup", function(){
    Reactives[currentPage].Question = qText.value;
});

clkBtn.addEventListener("click", function(){
    let imp = document.getElementById("clk");
    if(isNaN(imp.value)){
        imp.style.backgroundColor = "red";
    }else{
        if(imp.value > 60) imp.value = 60;
        else if(imp.value < 5) imp.value = 5;
        imp.value = parseInt(imp.value);
        Reactives[currentPage].time = imp.value;  

        imp.style.backgroundColor = "rgb(150, 227, 205)";
    }
    setTimeout(function(){ imp.style.backgroundColor = "white"; }, 1000);
});

ansSave.addEventListener("click", function(){
    let isAnswer = document.getElementById("ansCheckbox");
    if(ansText.value != ""){
    Reactives[currentPage].Answers[currKid.id.charAt(1)] = ansText.value;
    
    let val = currKid.id[1];
    if(isAnswer.checked){
        Reactives[currentPage].correct[val] = true;
    }else{
        Reactives[currentPage].correct[val] = false;
    }
    
    update();
    }
});

function assignFunction(){
    for(let i=0 ;i<ansA.length; i++){
        ansA[i].addEventListener("click", function(){
            currKid = event.target;
            if(currKid.tagName != "A"){
                currKid = currKid.firstElementChild;
            }
            ansText.value = currKid.text;
            console.log(currKid.text);
        });
    }
}

del.addEventListener("click", function(){
    if(Reactives[currentPage].Answers.length > 2){
        Reactives[currentPage].Answers.pop();
        update();
    }
});

add.addEventListener("click", function(){
    if(Reactives[currentPage].Answers.length < 4){
        Reactives[currentPage].Answers.push("I am chicken soup!");
        update();    
    }
});


leftArrow.addEventListener("click", function(){
    if(currentPage > 0){
        currentPage--;
        update();
    }
});

rightArrow.addEventListener("click", function(){
    if(currentPage < Reactives.length-1){
        currentPage++;
        update();
    }
});

function update(){
    pageIn.value = (`${('0' + (currentPage+1)).slice(-2)} / ${('0' + Reactives.length).slice(-2)}`);
    document.getElementById("clk").value = Reactives[currentPage].time;
   
    if(currentPage == Reactives.length -1) reactiveManager.hidden = false;
    else reactiveManager.hidden = true;

    if(Reactives.length > 1) deleteReactive.hidden = false;
    else deleteReactive.hidden = true;

    qImg.src = Reactives[currentPage].URL;
    qImg.onerror = function(){
        console.log("Image not found, using default one");
        qImg.src = "https://img2.gelbooru.com//images/9f/82/9f8218c9ac57e950f4b7bee129379347.jpg";
    };

    if(Reactives[currentPage].imgHidden) qImg.hidden = true;
    else qImg.hidden = false;

    qText.value = Reactives[currentPage].Question;
    divAns.innerHTML = "";
    for(let i=0; i<Reactives[currentPage].Answers.length; i++){
        if(Reactives[currentPage].Answers[i] != undefined){
            if(Reactives[currentPage].correct[i] == true) {
                divAns.innerHTML += `
                <div class="Answer isCorrect d-flex flex-column" data-toggle="modal" data-target="#AnswerModal">
                <a id="A${i}" class="Answer" data-toggle="modal" data-target="#AnswerModal">${Reactives[currentPage].Answers[i]}</a>
                </div>`;
            } else{
                divAns.innerHTML += `
                <div class="Answer d-flex flex-column" data-toggle="modal" data-target="#AnswerModal">
                <a id="A${i}" class="Answer" data-toggle="modal" data-target="#AnswerModal">${Reactives[currentPage].Answers[i]}</a>
                </div>`;
            }
        }
    }
    assignFunction();
}

update();