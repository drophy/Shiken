/// SOCKETS ///
const socket = io(`/`);

socket.on('next', function(objData) {
    // Check if it's a message from our game 
    if(objData.code === localStorage.code) location.href='voter.html';
 });

//Variables
let Target = document.getElementById("Target");
let ItemButtons = document.getElementById("AvailableItems").children;
let UserList = document.getElementById("userList");
let users = document.getElementsByClassName("userDiv");

let selectedItem = undefined;
let currentUser = undefined;

let players =[];
let debuffs = [true, false, true, false];
let shieldTarget = Math.round(Math.random*4);
let useShield = false;

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
        
        let s = document.querySelectorAll(".Selected");
        if(s.length != 0){
            for(let i=0; i<s.length; i++){
                s[i].className = ("ShikenBtn");
            }
        }
        
        selectedItem = event.target;
        selectedItem.className = "ShikenBtn Selected";

        Target.children[0].children[1].textContent = getItem(selectedItem.id);
        
    });
}

//For the shield
let usingGuard = false;
ItemButtons[4].addEventListener("click", function(){
    
    usingGuard = true;
    tempString = Target.children[1].children[1].textContent;
    
    Target.children[1].children[1].textContent = "Yourself";
    useShield = true;
});

function initUsersListeners(){
    for(let i=0; i<document.querySelectorAll(".userInfo").length; i++){
        document.querySelectorAll(".userInfo")[i].addEventListener("click", function(){
            console.log(event.target.tagName);
            if(event.target.tagName == "IMG"){
                selectedUser = event.target.parentNode.parentNode.parentNode.parentElement.id;
            }
            if(event.target.tagName == "TD"){
                selectedUser = event.target.parentNode.parentNode.parentNode.id;
            }
            Target.children[1].children[1].textContent = document.getElementById(selectedUser).children[0].children[0].textContent;
            if(document.querySelectorAll(".Usered").length != 0) document.querySelectorAll(".Usered")[0].className = "userInfo";
            document.getElementById(selectedUser).className= ("userInfo Usered");
            useShield = true;
        })
    }
}

function checkActiveDebuffs(){
    let dbfs = document.getElementsByClassName("debuff");
    for(let i=0; i<dbfs.length; i++){
        if(debuffs[i] == true) dbfs[i].className = "ShikenBtn debuff";
        else dbfs[i].className = "ShikenBtn debuff disabled";
    }
}

function init(){

    //Debug purposes
    for(let i=0; i<30; i++){
        players.push( new Player(`Alex Groot clone number ${i}`, i));
    }

    UserList.innerHTML = "";

    for(let i=0; i<players.length; i++){
        UserList.innerHTML += `
        <table id="p${players[i].id}" class="userInfo">
        <tr>
            <td rowspan="2" class="rowImg  userInfo">
                <img src="images/defaultUser.png" class="userImg  userInfo">
            </td>
            <td class="userName userInfo">
                ${players[i].name}
            </td>
        </tr>
        <tr>
            <td class="userId  userInfo">
                ${players[i].id}
            </td>
        </tr>
    </table> 
        `;
    }
    initUsersListeners();
    checkActiveDebuffs();
}

init();

/*setTimeout(function(){
    location.replace("voter.html");}
    , 10_000);
    */