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
    constructor(name, date, desc){
        this.id = 0;
        this.Reactives = [];
        this.Name = name;
        this.Date = date; 
        this.Description = desc;
        //this.items = I;
    }
}

//Variables
/*
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
*/
let currGame;
let currId = 0;

function newQuiz(name,description) {
    let table = document.getElementById("QuizTable");
    if(name == "") name = "My Game";
    if(description == "") description = "My description";
    currGame = new Game(name , getFecha(), description);
    currGame.id = currId;
    let row = table.insertRow(-1);
    row.setAttribute("id", `"Row${currId}"`);
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
function deleteFunction(index, value) {
    //let loli = document.getElementById("feynman").value;
    let i = index.parentNode.parentNode.rowIndex;
    if (value == "erase")
        document.getElementById("QuizTable").deleteRow(i);
    if(value=="edit"){
        localStorage.currentGame = JSON.stringify(currGame);
        location.href='TestEdit.html'
        //alert("hola");
    }
    if(value=="start")
        location.href = 'standings2.html'
        //alert("hola");
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
 