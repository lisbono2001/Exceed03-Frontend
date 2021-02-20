// const { strict } = require("assert");
// const { time } = require("console");

function update() {
    const fetch = require("node-fetch");
    fetch("#")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json);
            //addPatients(name, age, address);
            //updateStatus(name,status);
            console.error("ok");
    })
    .catch((error) => {
        console.error(error);
    });
}

var patientCount = 0

//add patients
function addPatients(name, age, address) {
    patientCount++;
    var patient = document.querySelector('#main-content').lastElementChild;
    //for first patient (use template)
    if (patientCount===1) {
        patient.id = 'patient'+patientCount;
        patient.getElementsByClassName("name")[0].textContent = "Name: " + name;
        patient.getElementsByClassName("age")[0].textContent = "Age: " + age;
        patient.getElementsByClassName("address")[0].textContent = "Address: " + address;
    }
    else {
        patientCount++;
        var clone = patient.cloneNode(true);
        clone.id = 'patient'+patientCount;
        clone.getElementsByClassName("name")[0].textContent = "Name: " + name;
        clone.getElementsByClassName("age")[0].textContent = "Age: " + age;
        clone.getElementsByClassName("address")[0].textContent = "Address: " + address;
        patient.after(clone);
    }
}

//loop update status from first to last patient
function updateStatus(name,status) {
    for (var i=1; i<=patientCount; i++) {
        var patient = document.querySelector('#patient'+patientCount);
        patient.getElementsByClassName("name")[0].textContent === name;
            if (status==="online") {
                patient.getElementsByClassName("status-ligjht")[0].style.backgroundColor = "green";
            }
            else if (status==="idle") {
                patient.getElementsByClassName("status-ligjht")[0].style.backgroundColor = "orange";
            }
            else if (status==="danger") {
                patient.getElementsByClassName("status-ligjht")[0].style.backgroundColor = "red";
                alertScreen(patient.id)
            }
    }
}


function checkEmpty(){
    var value = document.getElementById('message').value;
    if (value.trim().length > 0) {
        document.getElementById('submit-message').disabled = false; 
        document.getElementById('set-time').disabled = false; 
    } 
    else { 
        document.getElementById('submit-message').disabled = true;
        document.getElementById('set-time').disabled = true; 
    }
}

//change specific patient background color to danger color
function alertScreen(patientid) {
    window.setInterval(()=>{
        if (document.getElementById("patientid").style.backgroundColor === "blue")
            document.getElementById("patientid").style.backgroundColor = "red";
        else
            document.getElementById("patientid").style.backgroundColor = "blue";
    },3000);
}

var dayArray = [];
var formCounted = 1;
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//clear data from dayArray and re-color day buttons.
function setTime() {
    var message = document.getElementById("message").value;
    if (message.trim() == "") {  // if no any message are in text box just popup error.
        window.alert("please type something!!");
        $('#popup').modal("hide");
        document.getElementById("message").value = '';
        return;
    }
    $('#popup').modal("show");  // show modal.
    for (var i=0; i < dayArray.length; i++) {
        document.getElementById(dayArray[i]).style.backgroundColor = "gainsboro";
    }
    initForm();

    now = new Date(Date.now());  // time now
    document.getElementById("hours").value = now.getHours();  // auto fill hour to be current time.
    document.getElementById("mins").value = now.getMinutes() + 1;  // auto fill hour to be current time.

    var dayName = days[now.getDay()];
    selectDay(dayName);
}

//clear and recreate time form
function initForm() {
    var container = document.getElementById("form-group");
    //clear until left only form starter template
    while (formCounted > 1) {
        container.removeChild(container.lastChild);
        formCounted--;
    }
}

////decrease number of time form in set time
function reduceForm() {
    var container = document.querySelector('#form-group');
    if (formCounted > 1) {
        container.removeChild(container.lastElementChild);
        formCounted--;
    }
    else;
}

//increase number of time form in set time
function addForm() {
    //given maximun form === 5
    if (formCounted < 5) {
        formCounted++;
        var form = document.querySelector('#form-group').lastElementChild;
        var clone = form.cloneNode(true);

        clone.id = 'form'+formCounted;
        form.after(clone);
    }
    else;
}

//add clicked day to day Array and re-color the clicked button.
function selectDay(day) {
    if (!dayArray.includes(day)) {
        dayArray.push(day);
        document.getElementById(day).style.backgroundColor = "lightcoral";
    }
    else {
        i = dayArray.indexOf(day);
        dayArray.splice(i,1);
        document.getElementById(day).style.backgroundColor = "gainsboro";
    }
}

// -------  POST request to DB  -------

// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:5500/";

//sameple post
function inset(jsonData) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: jsonData['name'], address: jsonData['address']};
    dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    }); 
    });
}

//sent message to patient
function sentMessage() {
    message = document.getElementById("message").value;
    if (message.trim() == "") {
        window.alert("please type something!!");
        return;
    }
    document.getElementById("message").value = '';
    console.log(message);
}

//save message day(s) and time(s) from form
function saveMessage() {
    message = document.getElementById("message").value;
    if (message.trim() == "") {
        $('#popup').modal("hide");
        window.alert("please type something!!");
        return;
    }
    console.log(dayArray);

    if (!checkValidTime()) {  // check time
        return;
    }

    if (dayArray.length == 0) {
        window.alert("please select day to send message!!");
        return;
    }
    hours = document.getElementById("hours");
    mins = document.getElementById("mins");
}

// check if time in message box is valid (not in the pass)
function checkValidTime() {
    now = new Date(Date.now());  // time now
    hours = document.getElementById("hours").value;
    mins = document.getElementById("mins").value;
    set_time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, mins);
    if (dayArray.length > 1 || !dayArray.includes(days[now.getDay()])) {
        return true;
    }
    if (set_time.getTime() < now.getTime()) {
        document.getElementById("hours").value = now.getHours();
        document.getElementById("mins").value = now.getMinutes() + 1;
        window.alert("you cannot send message to the pass!!");
        return false;
    }
    return true;
}

function formatTime() {
    if (document.getElementById("hours").value > 23) {
        document.getElementById("hours").value = 23;
    }
    else if (document.getElementById("hours").value < 0) {
        document.getElementById("hours").value = 0;
    }
    if (document.getElementById("mins").value > 59) {
        document.getElementById("mins").value = 59;
    }
    else if (document.getElementById("mins").value < 0) {
        document.getElementById("mins").value = 0;
    }
}

function showHistory() {
    var historyList = document.getElementById("history-container");
    // console.log(historyList);
    for (i=0; i<35; i++) {  // for loop append all history.
        var li = document.createElement("div");
        li.appendChild(document.createTextNode("History of everything"));
        historyList.appendChild(li);
    }
    $('#history').modal("show");
}

function showSchedule() {
    var historyList = document.getElementById("schedule-container");
    // console.log(historyList);
    for (i=0; i<35; i++) {  // for loop append all history.
        var li = document.createElement("div");
        li.appendChild(document.createTextNode("Schedule of everything"));
        historyList.appendChild(li);
    }
    $('#schedule').modal("show");
}

document.getElementById("sent-message").addEventListener("click", sentMessage);
document.getElementById("save-time").addEventListener("click", saveMessage);
document.getElementById("set-time").addEventListener("click", setTime);

document.getElementById("history-tab").addEventListener("click", showHistory);
document.getElementById("schedule-tab").addEventListener("click", showSchedule);

document.getElementById("hours").addEventListener("change", formatTime);
document.getElementById("mins").addEventListener("change", formatTime);

// setInterval(()=> update(),1000);