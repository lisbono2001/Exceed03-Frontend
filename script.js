//assume that patient id is sorted
function updatePatientNumber() {
    fetch("http://158.108.182.3:3000/all_user")
        .then((response) => {
        return response.json();
    })
    .then((json) => {
        //if number of patient in the page and json file doesn't match
        console.log(json);
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

// function setPatientInfo(patientID, name, age, address) {
//     // patient = document.getElementById('patient'+patientID)
//     var patient = document.querySelector('#patient'+patientID);
//     if (status==="normal") {
//         patient.querySelector("#status-light").style.backgroundColor = "green";
//     }
//     else if (status==="idle") {
//         patient.querySelector("#status-light").style.backgroundColor = "orange";
//     }
//     else if (status==="danger") {
//         patient.querySelector("#status-light").style.backgroundColor = "red";
//         alertScreen(patient.id);
//     }
// }

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
    if (value.trim().length > 0) {
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
// var formCounted = 1;
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var days_full = {Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday"};

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
    initSetTimeForm();

    now = new Date(Date.now());  // time now
    document.getElementById("hours").value = now.getHours();  // auto fill hour to be current time.
    document.getElementById("mins").value = now.getMinutes() + 1;  // auto fill hour to be current time.

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
    // console.log(dayArray);
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

    url = "http://158.108.182.3:3000/new_msg?user_id=1"  // change user id.

    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            message: message,
            type: "live"
        })
    }).then((response) => console.log(response))
    .then((result) => console.log(result));
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
    hours = parseInt(document.getElementById("hours").value);
    mins = parseInt(document.getElementById("mins").value);

    url = "http://158.108.182.3:3000/create_schedule?user_id=1"  // change user id.
    var day_schedule = [];
    for (i=0; i<dayArray.length; i++) {
        day_schedule.push(days_full[dayArray[i]]);
    }
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            message: message,
            type: "schedule",
            hour: hours,
            minute: mins,
            second: 0,
            day: day_schedule
        })
    }).then((response) => console.log(response))
    .then((result) => console.log(result));
    $('#popup').modal("hide");
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



function showSchedule() {
    const url = "http://158.108.182.3:3000/msg?user_id=1";

    // console.log(sch_list.length);

    var historyList = document.getElementById("schedule-container");
    historyList.innerHTML = "";
    var all_schedules = document.createElement("ul");

    fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    }).then((response) => {
        return response.json();
    }).then((json) => {
        //if number of patient in the page and json file doesn't match
        // console.log(json.result)
        for (const message in json.result) {
            data = json.result[message];
            if (data.type == "schedule") {
                var sch = document.createElement("li");
                const event = new Date(2000, 1, 1, data.hour, data.minute);
                var time = event.toLocaleTimeString('it-IT');
                // console.log(event.toLocaleTimeString('it-IT'));
                var days = "";
                for (i=0; i<data.day.length; i++) {
                    days += data.day[i].substring(0, 3) + " ";
                }
                sch.innerHTML = data.message + " - " + time + " - " + days;

                var remove_btn = document.createElement("button");
                remove_btn.className = "remove-btn";
                remove_btn.innerHTML = "remove";
                remove_btn.onclick = function() {
                    fetch("http://158.108.182.3:3000/delete_schedule?msg_id="+data.msg_id, {
                        method: "DELETE"
                    });
                    $('#schedule').modal("hide");
                };
                sch.appendChild(remove_btn);

                all_schedules.appendChild(sch);
            }
        }
    });
    historyList.appendChild(all_schedules)
    $('#schedule').modal("show");
}

function showPatientList() {
    var patientList = document.getElementById("patientlist-container");
    $('#patientlist-container').empty();
    fetch("http://158.108.182.3:3000/all_user")
        .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json);
        json["result"].forEach(patientdata => {
            var patient = document.createElement("button");
            patient.className = "patient";
            patient.id = "patient";
            patient.innerHTML = patientdata["name"];
            patient.addEventListener("click", ()=> {
                currentPatientID = patientdata["user_id"];
                $('#patientlist').modal("hide");
                updatePatientInfo();
            });
            if (patientdata['status']==="normal") {
                patient.style.backgroundColor = "green"
            }
            else if (patientdata['status']==="idle") {
                patient.style.backgroundColor = "orange"
            }
            else if (patientdata['status']==="danger") {
                patient.style.backgroundColor = "red"
            }
            patientList.appendChild(patient);
        });
    })
    .catch((error) => {
        console.error(error);
    });
    $('#patientlist').modal("show");
}

var currentPatientID = 1;

function updatePatientInfo() {
    let patient_id = currentPatientID - 1;
    fetch("http://158.108.182.3:3000/all_user")
        .then((response) => {
        return response.json();
    })
    .then((json) => {
    patientdata = json["result"];
    var patient = document.querySelector('#patientboard');
    patient.querySelector('#name').innerHTML = patientdata[patient_id]["name"];
    patient.querySelector('#age').innerHTML = patientdata[patient_id]["age"];
    patient.querySelector('#address').innerHTML = patientdata[patient_id]["address"];

    let status = patientdata[patient_id]["status"];
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
    })
    .catch((error) => {
        console.error(error);
    });
}

//EventListeners

document.getElementById("message").addEventListener("keyup", checkEmptyMessage);
document.getElementById("set-time").addEventListener("click", setTime);
document.getElementById("set-time").addEventListener("click", initSetTimeForm);
// document.getElementById("reduce-form").addEventListener("click", reduceSetTimeForm);
// document.getElementById("add-form").addEventListener("click", addSetTimeForm);
Array.from(document.getElementsByClassName('day')).forEach(function(element){
  element.addEventListener("click", selectDay);
});
document.getElementById("sent-message").addEventListener("click", sentMessage);
document.getElementById("save-time").addEventListener("click", saveMessage);
document.getElementById("schedule-tab").addEventListener("click", showSchedule);
document.getElementById("patientlist-tab").addEventListener("click", showPatientList);

document.getElementById("hours").addEventListener("change", formatTime);
document.getElementById("mins").addEventListener("change", formatTime);

setInterval(()=> updatePatientInfo(),1000);
// setInterval(()=> updatePatientStatus(),1000);
