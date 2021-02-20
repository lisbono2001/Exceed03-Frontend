//assume that patient id is sorted
function updatePatientNumber() {
// const { strict } = require("assert");
// const { time } = require("console");
    fetch("#")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        //if number of patient in the page and json file doesn't match
        if (json.length > currentPatientCount) {
            for (var i=currentPatientCount+1; i<=json.length ; i++) {
                addPatientField(json[i]['name'],json[i]['age'],json[i]['address']);
            }
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

//update each patient status
function updatePatientStatus() {
    fetch("#")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        for (var i=1; i<=currentPatientCount ; i++) {
            setPatientStatus(json[i]['user_id'],json[i]['status'],json[i]['last_update_timestamp']);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

// use when called
function updatePatientMessageLog() {
    fetch("#")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        // update message on popup
    })
    .catch((error) => {
        console.error(error);
    });
}

var currentPatientCount = 0

//add patients
function addPatientField(name, age, address) {
    currentPatientCount++;
    var patient = document.querySelector('#main-content').lastElementChild;
    //for first patient (use template)
    if (currentPatientCount===1) {
        patient.id = 'patient'+currentPatientCount;
        patient.querySelector('#name').innerHTML = name;
        patient.querySelector('#age').innerHTML = age;
        patient.querySelector('#address').innerHTML = address;
    }
    else {
        currentPatientCount++;
        var clone = patient.cloneNode(true);
        clone.id = 'patient'+currentPatientCount;
        clone.querySelector('#name').innerHTML = name;
        clone.querySelector('#age').innerHTML = age;
        clone.querySelector('#address').innerHTML = address;
        clone.querySelector('#message').value = "";
        patient.after(clone);
    }
}

function setPatientInfo(patientID, name, age, address) {
    // patient = document.getElementById('patient'+patientID)
    var patient = document.querySelector('#patient'+patientID);
    if (status==="normal") {
        patient.querySelector("#status-light").style.backgroundColor = "green";
    }
    else if (status==="idle") {
        patient.querySelector("#status-light").style.backgroundColor = "orange";
    }
    else if (status==="danger") {
        patient.querySelector("#status-light").style.backgroundColor = "red";
        alertScreen(patient.id);
    }
}

//loop update status from first to last patient
function setPatientStatus(patientID, status, lastTimestamp) {
    var patient = document.querySelector('#patient'+patientID);
    if (status==="normal") {
        patient.querySelector("#status-light").style.backgroundColor = "green";
    }
    else if (status==="idle") {
        patient.querySelector("#status-light").style.backgroundColor = "orange";
    }
    else if (status==="danger") {
        patient.querySelector("#status-light").style.backgroundColor = "red";
        alertScreen(patient.id);
    }
}

//if text messsage is empty, disable send and settime button
function checkEmptyMessage(){
    var value = document.getElementById('message').value;
    if (value.length > 0) {
        document.getElementById('sent-message').disabled = false; 
        document.getElementById('set-time').disabled = false; 
    } 
    else { 
        document.getElementById('sent-message').disabled = true;
        document.getElementById('set-time').disabled = true; 
    }
}

//change specific patient background color to danger color
function alertScreen(patientid) {
    window.setInterval(()=>{
        if (document.getElementById(patientid).style.backgroundColor === "blue")
            document.getElementById(patientid).style.backgroundColor = "red";
        else
            document.getElementById(patientid).style.backgroundColor = "blue";
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
function initSetTimeForm() {
    var container = document.getElementById("form-group");
    //clear until left only form starter template
    while (formCounted > 1) {
        container.removeChild(container.lastChild);
        formCounted--;
    }
}

//decrease number of time form in set time
function reduceSetTimeForm() {
    var container = document.querySelector('#form-group');
    if (formCounted > 1) {
        container.removeChild(container.lastElementChild);
        formCounted--;
    }
    else;
}

//increase number of time form in set time
function addSetTimeForm() {
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
function selectDay() {
    if (!dayArray.includes(this.value)) {
        dayArray.push(this.value);
        this.style.backgroundColor = "lightcoral";
    }
    else {
        dayArray.splice(dayArray.indexOf(this.value),1);
        this.style.backgroundColor = "gainsboro";
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
    document.getElementById("message").value = "";
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

//EventListeners

document.getElementById("message").addEventListener("keyup", checkEmptyMessage);
document.getElementById("set-time").addEventListener("click", setTime);
document.getElementById("set-time").addEventListener("click", initSetTimeForm);
document.getElementById("reduce-form").addEventListener("click", reduceSetTimeForm);
document.getElementById("add-form").addEventListener("click", addSetTimeForm);
Array.from(document.getElementsByClassName('day')).forEach(function(element){
  element.addEventListener("click", selectDay);
});
document.getElementById("sent-message").addEventListener("click", sentMessage);
document.getElementById("save-time").addEventListener("click", saveMessage);
document.getElementById("set-time").addEventListener("click", setTime);

// setInterval(()=> updatePatientNumber(),5000);
// setInterval(()=> updatePatientStatus(),1000);