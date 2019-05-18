// temporary - remove data on load
localStorage.removeItem("test")
const topicNames = "topic-names"

function load() {
    var topicNameData = localStorage.length;
    if (topicNameData == 0) {
        // first time page is loaded
    } else {
        // create a button for each topic in topicNameData
        for (i = 0; i < localStorage.length; i++) {
            var button = document.createElement("BUTTON");
            button.innerHTML = localStorage.key(i);
            document.body.appendChild(button);
        }
    }
}
// query database for study topics 
// create buttons dynamically (names and colors)


function submitTopic() {
    var name = document.getElementById("new-topic").value
    if (name == "") {
        alert("Couldn't see any text");
        return;
    }
    // check if button with that name already exists, if not:
    if (localStorage.getItem(name) == null) {
        // create new button
        var dates_data = JSON.stringify([]);
        localStorage.setItem(name,dates_data);
        var button = document.createElement("BUTTON")
        button.innerHTML = name
        document.body.appendChild(button)
    } else {
        // else alert user 
        alert("Topic with that name already exists")
    }
}

function studied() {
    var name = "test"
    const today = new Date();
    var dates = JSON.parse(localStorage.getItem(name));
    debugger;
    // assume not null
    dates.forEach(dateStr => {
        date = new Date(dateStr)
        if (sameDay(today,date)) {
            return
        }
    });
    dates.push(today);
    document.getElementById("test-topic").style.backgroundColor = "green";
    localStorage.setItem(name, JSON.stringify(dates));
}




function getStudyDates() {
    var name = "test";
    var dates = JSON.parse(localStorage.getItem(name));
    dates.forEach(dateStr => console.log(dateStr));
}

function sameDay(d1, d2) {
    return d1.getFullYear() == d2.getFullYear() &&
      d1.getMonth() == d2.getMonth() &&
      d1.getDate() == d2.getDate();
  }
function print_local_storage() {
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    console.log( localStorage.getItem( localStorage.key( i ) ) );
  }
}