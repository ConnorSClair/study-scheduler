/* Called when website is opened. Loads data from previous sessions using localStorage API */
function on_load() {
    for (i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        create_button(name);
        colorise_button(name);
    }
}

/* create any button. Used on load as well as used when new study topic
*/
function create_button(name) {
    var button = document.createElement("BUTTON");
    button.innerHTML = name;
    button.id = name;
    document.getElementById("buttons").appendChild(button);
    document.getElementById(name).setAttribute("onclick","studied(this)");
}

/* given a button that exists, colorise based on streak logic
*/
function colorise_button(name) {
    // simple first. studied today then green, otherwise grey
    if (name != "") {
        dates = retrieveData(name)
        if (dates.length == 0) {
            document.getElementById(name).style.backgroundColor = "grey";
            return;
        }
        // assumes ordered from smallest to largest (latest date is at end of list)
        date = Date(dates[dates.length - 1]) 
        if (sameDay(new Date(date),new Date())) {
            document.getElementById(name).style.backgroundColor = "green";
        } else {
            document.getElementById(name).style.backgroundColor = "grey";
        }        
    }
}

/* store data in localStorage */
function storeData(key,value) {
    var data = JSON.stringify(value);
    localStorage.setItem(key,data);

}

/* retrieve data from localStorage */
function retrieveData(key) {
    var data = localStorage.getItem(key);
    return JSON.parse(data)
}

/* retrieves text from textField and creates a new button.
appropriately handles no text or duplicate topics
*/ 
function newTopic() {
    var topic = document.getElementById("new-topic").value
    if (topic == "") {
        return;
    }
    // check if button with that name already exists
    if (retrieveData(topic) == null) {
        storeData(topic,[]);
        create_button(topic);
        colorise_button(topic);
    } else {
        alert("Topic with that name already exists")
    }
}

/* on button press
*/ 
function studied(button) {
    var name = button.id
    const today = new Date();
    var dates = retrieveData(name)
    if (dates != null) {
        for (var dateStr of dates) {
            date = new Date(dateStr);
            if (sameDay(today,date)) {
                return;
            }
        }
    }
    dates.push(today);
    storeData(name,dates);
    colorise_button(name)
}

function sameDay(d1, d2) {
    return d1.getFullYear() == d2.getFullYear() &&
      d1.getMonth() == d2.getMonth() &&
      d1.getDate() == d2.getDate();
}

function deleteTopic() {
    var topic_name = prompt("Type in the topic name you would like to delete")
    if (retrieveData(topic_name) != null) {
        // TODO: remove button 
        localStorage.removeItem(topic_name);
    }   
}

function deleteAllData() {
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem(localStorage.key(i));
    }
}

/*
function submitTopicB() {
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

// temporary - remove data on load
// removeAll();

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









//useless functions below
function getStudyDates() {
    return 0
    var dates = JSON.parse(localStorage.getItem(name));
    dates.forEach(dateStr => console.log(dateStr));
}
function print_local_storage() {
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    console.log( localStorage.getItem( localStorage.key( i ) ) );
  }
}

*/