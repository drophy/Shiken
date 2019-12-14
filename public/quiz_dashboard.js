
//Variables
/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
*/
let currGame;
let currId = 0;
let table = document.getElementById("QuizTable");

update();

document.querySelector('#log-out').addEventListener('click', function(event){
    localStorage.removeItem('token');
    location.href='index.html';
});

async function addQuizDB(game){
    //let output = JSON.stringify(game);
    try{
        let response = await fetch(`/games/add`, { 
            method: 'POST',
            headers: {'content-type':'application/json', 'x-auth':localStorage.token},
            body: JSON.stringify({Game: game})
        });
        let objResponse = await response.json();
        console.log(objResponse.Message)
    } catch(error){
        console.log(error);
    }
}

function newQuiz(name,description) {
    let table = document.getElementById("QuizTable");
    if(name == "") name = "My Game";
    if(description == "") description = "My description";
    currGame = new Game(name , getFecha(), description);
    console.log(currGame); // DBUG
    addQuizDB(currGame);
    currGame.id = currId;
    let row = table.insertRow(-1);
    row.setAttribute("id", `"Quiz${currId}"`);
    let cell1 = row.insertCell(-1);
    let cell2 = row.insertCell(-1);
    let cell3 = row.insertCell(-1);
    cell1.innerHTML = currGame.Name;
    //cell1.appendChild(selectList);
    let selectList = document.createElement("select");

    let option = document.createElement("option");
    option.value = "default";
    option.text = "Quiz options";

    let option1 = document.createElement("option");
    option1.value = "start";
    option1.text = "Start quiz";

    let option2 = document.createElement("option");
    option2.value = "edit";
    option2.text = "Edit";

    let option3 = document.createElement("option");
    option3.value = "erase";
    option3.text = "Delete";

    selectList.appendChild(option);
    selectList.appendChild(option1);
    selectList.appendChild(option2);
    selectList.appendChild(option3);
    //selectList.setAttribute("onchange",function(){deleteFunction(this,value);});
    selectList.addEventListener(
        'change',function() { deleteFunction(this,this.value); });

    cell1.appendChild(selectList);
    cell2.innerHTML = currGame.Date;
    cell3.innerHTML = currGame.Description;
    //$("#includedContent").load("editor.html");
    currId ++;
}
async function deleteFunction(index, value) {
    let i = index.parentNode.parentNode.rowIndex;
    if (value == "erase")
        document.getElementById("QuizTable").deleteRow(i);
    if(value=="edit"){

        localStorage.gameId = (i-1);
        location.href='TestEdit.html'
    }
    if(value=="start") {
        // Get code for the game
        let response = await fetch(`/game/id/${i-1}`, {
            method: 'GET',
            headers: {'content-type':'application/json', 'x-auth':localStorage.token}
        });
        let objResponse = await response.json();
        localStorage.gameId = objResponse.gameId;
        localStorage.gameState = 0; // states: start (0), mid game (1), end (2)
        localStorage.removeItem('objGame'); // so data from the previous game isn't used
        location.href = 'standings2.html'
    }
}
function searh() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("buscar");
    filter = input.value.toUpperCase();
    table = document.getElementById("QuizTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
function sortBy() {
    //criteria.options[criteria.selectedIndex].getAttribute("myid");
    let loli = document.getElementById("sortSelect").value;
    if (loli == 1) {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("QuizTable");
        switching = true;
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    } else {
        alert("ordenar por fecha");
    }
}
//document.getElementById("demo").innerHTML = d.getMonth();

function getFecha(){
let d = new Date();
let dia = d.getDate();
let mes = d.getMonth() + 1;
let year = d.getFullYear();
if (dia < 10) {
    dia = '0' + dia;
}
if (mes < 10) {
    mes = '0' + mes;
}
let hoy = dia + "/" + mes + "/" + year;
return hoy;
document.getElementById("Date").innerHTML = hoy;
}

// Create new quiz
document.querySelector('#creaQuizBTN').addEventListener('click', function() {
    let x=document.querySelector("#quizName1").value;
    let y=document.querySelector("#descQuiz").value;
    newQuiz(x, y);
});
 
async function update(){
    let userToken = localStorage.token;
    currId = 0;

    try{
        let response = await fetch(`/quiz`, { 
            method: 'GET',
            headers: {'content-type':'application/json', 'x-auth':userToken}
        });
        let tests = await response.json();

        table.children[0].innerHTML = `
        <tr>
        <th style="width:200px">Quiz</th>
        <th >Date</th>
        <th>Description</th>
        </tr>`;
        for(let i=0; i<tests.games.length; i++){
            table.children[0].innerHTML += `
            <tr id="Quiz${i}">
            <td>${tests.games[i].Name}<br>
              <select name="menu" onChange="deleteFunction(this,value)" >
                <option value="default" selected>Quiz options</option>
                <option value="start">Start quiz</option>
                <option value="edit">Edit</option>
                <option value="erase" >Delete</option>
              </select>
            </td>
            <td>${tests.games[i].Date}</td>
            <td>${tests.games[i].Description}</td>
          </tr>
            `;
            currId++;
        }
    
    }catch(error){
        console.log(error);
        alert("There was a problem loading the quizzes!");
    }

}

function fillTable(){

}
