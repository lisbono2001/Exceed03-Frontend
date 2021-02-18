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
    if (message!="") {
        document.getElementById("modal-title").innerHTML = "Message: " + message;
        document.getElementById("modal-title").style.color = "black";
        //enable buttons;
        document.getElementById("save-message").disabled = false;
        document.getElementById("add-form").disabled = false;
        document.getElementById("reduce-form").disabled = false;
    }
    else {
        document.getElementById("modal-title").innerHTML = "Type something first";
        document.getElementById("modal-title").style.color = "red";
        //disable sbuttons;
        document.getElementById("save-message").disabled = true;
        document.getElementById("add-form").disabled = true;
        document.getElementById("reduce-form").disabled = true;
    }
    //clear select day color and clear day array
    dayArray = [];
    for (var i=0; i<dayArray.length; i++) {
        document.getElementById(dayArray[i]).style.backgroundColor = "gainsboro";
    }
    initForm();

    //hide error message until error occured
    document.getElementById('error-message').style.display = "none";
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

var MongoClient = require('mongodb').MongoClient;
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

}

//save message day(s) and time(s) from form
function saveMessage() {
    var data = {}
    for (var i=1; i<=formCounted ;i++) {
        //get string values
        try {
            var hours = parseInt(document.getElementById('hours'+i).value);
            var mins =  parseInt(document.getElementById('mins'+i).value);
            document.getElementById('error-message').style.display = "block";
            document.getElementById('error-message').innerHTML = hours+mins;
        }
        catch(err) {
            document.getElementById('error-message').style.display = "block";
        }
    }
}


setInterval(()=> update(),1000);