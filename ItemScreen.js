//Variables
var Target = document.getElementById("Target");
var ItemButtons = document.getElementById("AvailableItems").children;
var UserList = document.getElementById("userList");
var users = document.getElementsByClassName("userDiv");

var selectedItem = undefined;
var currentUser = undefined;

function getItem(string){
    switch(string){
        case "HenBtn":
            return "Annoying Hen";
        case "SleepBtn":
            return "Sleeping Chicks";
            break;
        case "EggBtn":
            return "Eggy Screen";
            break;
        case "FlipBtn":
            return "Flip Answers";
            break;
        case "GuardBtn":
            return "Cleanse Debuff"
            break;
    }
}

for(let i=0; i<ItemButtons.length-1; i++){
    ItemButtons[i].addEventListener("click", function(){
        selectedItem = event.target;
        Target.children[0].children[1].textContent = getItem(selectedItem.id);
        users = document.getElementsByClassName("userDiv");
    });
}

ItemButtons[4].addEventListener("click", function(){
    Target.children[0].children[1].textContent = getItem("GuardBtn");
    Target.children[1].children[1].textContent = "Yourself";
});

function init(){
    UserList.innerHTML = "";
    for(let i=0; i<30; i++){
        UserList.innerHTML += `
        <div id="p${i}" class="row userDiv" data-dismiss="modal">
        <h5>User ${i} / ${i*2} points</h5>                
        </div> 
        `;
    }
    for(let i=0; i<users.length; i++){
        users[i].addEventListener("click", function(){
            if(event.target.tagName == "H5"){
                currentUser = event.target.parentNode;
            }else currentUser = event.target;

            Target.children[1].children[1].textContent = currentUser.children[0].textContent;
        });
    }
}

init();

setTimeout(function(){
    location.replace("voter.html");}
    , 10_000);