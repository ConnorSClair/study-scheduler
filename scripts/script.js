// temporary - remove data on load
//removeAll();

function load() {
    var topicNameData = localStorage.length;
    if (topicNameData == 0) {
        // first time page is loaded
    } else {
        // create a button for each topic in topicNameData
        for (i = 0; i < localStorage.length; i++) {
            var button = document.createElement("BUTTON");
            name = localStorage.key(i)
            button.innerHTML = name;
            button.id = name;
            //button.onclick = alert("hey");
            document.body.appendChild(button);
            document.getElementById(name).setAttribute("onclick","studied(this)");
            document.getElementById(name).style.backgroundColor = "grey"
        }
    }
    colorise();
}

function colorise() {
    for (i = 0; i < localStorage.length; i++) {
        var today =  new Date();
        var name = localStorage.key(i);
        var dates = JSON.parse(localStorage.getItem(name));
        if (dates != null) {
            for (var dateStr of dates) {
                date = new Date(dateStr);
                if (sameDay(today,date)) {
                    document.getElementById(name).style.backgroundColor = "blue"
                    break;
                }
            }
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
        button.id = name;
        document.body.appendChild(button)
        document.getElementById(name).setAttribute("onclick","studied(this)");
    } else {
        // else alert user 
        alert("Topic with that name already exists")
    }
}

function studied(button) {
    var name = button.id
    const today = new Date();
    var dates = JSON.parse(localStorage.getItem(name));
    // assume not null
    if (dates != null) {
        for (var dateStr of dates) {
            date = new Date(dateStr)
            if (sameDay(today,date)) {
                return
            }
        }
    }
    dates.push(today);
    document.getElementById(name).style.backgroundColor = "green";
    localStorage.setItem(name, JSON.stringify(dates));
}




function getStudyDates() {
    return 0
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

function removeAll() {
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        localStorage.removeItem( localStorage.key( i ));
    }
}