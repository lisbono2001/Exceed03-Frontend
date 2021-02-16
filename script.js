
function update() {
    const fetch = require("node-fetch");
    fetch("http://127.0.0.1:5501/Exceed03-Frontend/sample.json")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json);
    })
    .catch((error) => {
        console.error(error);
    });
}

function loadPage() {

}

function updateStatus(json) {
    //updata status via name every sec
    //if anything occur call modal
}

//change specific patient background color to danger color
function alert() {
    window.setInterval(()=>{
        if (document.getElementById("firstpatient").style.backgroundColor === "blue")
            document.getElementById("firstpatient").style.backgroundColor = "red";
        else
            document.getElementById("colorfirstpatientbutton").style.backgroundColor = "blue";
    },100);
}

var dayArray = [];
//clear data from dayArray and re-color day buttons.
function setTime() {
    for (var i=0; i<dayArray.length; i++) {
        document.getElementById(dayArray[i]).style.backgroundColor = "gainsboro";
    }
    dayArray = [];
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

//post value to DB
function saveMessage() {

}

setInterval(()=> update(),1000);