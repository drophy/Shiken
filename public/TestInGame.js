var time = parseInt(document.getElementById("clk").value);
var clock = document.getElementById("clk");
var answers = document.getElementById("Answers").children;

var paused = false;

answers[0].addEventListener("click", function(){
        paused = !paused;
});

answers[1].addEventListener("click", function(){
    //Skip
});

answers[2].addEventListener("click", function(){
    //Cancel Quiz
});

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

count();