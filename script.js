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
        if (document.getElementById("patientid").style.backgroundColor === "blue")
            document.getElementById("patientid").style.backgroundColor = "red";
        else
            document.getElementById("patientid").style.backgroundColor = "blue";
    },3000);
}

var dayArray = [];
var formCounted = 1;

//clear data from dayArray and re-color day buttons.
function setTime() {
    var message = document.getElementById("message").value;
    document.getElementById("modal-title").innerHTML = "Message: " + message;
    //clear select day color and clear day array
    dayArray = [];
    for (var i=0; i<dayArray.length; i++) {
        document.getElementById(dayArray[i]).style.backgroundColor = "gainsboro";
    }
    initSetTimeForm();

    //hide error message until error occured
    document.getElementById('error-message').style.display = "none";
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

////decrease number of time form in set time
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
    console.log(this);
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
    console.log("Message sent!!");
    // document.getElementById("sent-message").innerHTML = "Sent!!";
}

//save message day(s) and time(s) from form
function saveMessage() {
    console.log("Save the day!!")
    console.log(dayArray);
}


//EventListeners

document.getElementById("message").addEventListener("keyup", checkEmptyMessage);
document.getElementById("set-time").addEventListener("click", setTime);
document.getElementById("reduce-form").addEventListener("click", reduceSetTimeForm);
document.getElementById("add-form").addEventListener("click", addSetTimeForm);
Array.from(document.getElementsByClassName('day')).forEach(function(element){
  element.addEventListener("click", selectDay);
});
document.getElementById("sent-message").addEventListener("click", sentMessage);
document.getElementById("save-time").addEventListener("click", saveMessage);

// setInterval(()=> update(),1000);