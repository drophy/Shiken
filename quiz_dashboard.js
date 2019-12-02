function newQuiz(name,description) {
    let table = document.getElementById("QuizTable");
    let q = new quiz(name, new Date(), description);
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(-1);
    let cell2 = row.insertCell(-1);
    let cell3 = row.insertCell(-1);
    cell1.innerHTML = q._name_;
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
    cell2.innerHTML = q._date_;
    cell3.innerHTML = q._description_;
    //$("#includedContent").load("editor.html");
    
}
function deleteFunction(index, value) {
    //let loli = document.getElementById("feynman").value;
    let i = index.parentNode.parentNode.rowIndex;
    if (value == "erase")
        document.getElementById("QuizTable").deleteRow(i);
    if(value=="edit")
        location.href='TestEdit.html'
        //alert("hola");
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
class quiz {
    constructor(name, date, description) {
        this.name = name;
        this.date = date;
        this.description = description;
    }
    get date() {
        return this._date_;
    }
    set date(value) {
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
        this._date_ = dia + "/" + mes + "/" + year;
    }
    get name() {
        return this._name_;
    }
    set name(value) {
        this._name_ = value;
    }
    get description() {
        return this._description_;
    }
    set description(value) {
        this._description_ = value;
    }

}

//function fecha(){
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
document.getElementById("Date").innerHTML = hoy;
//}:

// Create new quiz
document.querySelector('#creaQuizBTN').addEventListener('click', function() {
    let x=document.querySelector("#quizName1").value;
    let y=document.querySelector("#descQuiz").value;
    newQuiz(x, y);
});