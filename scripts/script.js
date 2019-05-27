/* Called when website is opened. Loads data from previous sessions using localStorage API */
function on_load() {
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    if (topicNameData === null) {
        topicNameData = []
        storeData("TOPIC-NAME-DATA",topicNameData)
    }
    for (i = 0; i < topicNameData.length; i++) {
        var name = topicNameData[i];
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
    //document.getElementById(name).setAttribute("class","waves-effect waves-light btn-large");
}

/* given a button that exists, colorise based on streak logic
*/
function colorise_button(name) {
    // simple first. studied today then green, otherwise grey
    if (name != "") {
        var dates = retrieveData(name)
        if (dates.length === 0) {
            document.getElementById(name).style.backgroundColor = "grey";
            return;
        }
        // assumes ordered from smallest to largest (latest date is at end of list)
        const latestDate = new Date(dates[dates.length - 1]) 
        const nameElement = document.getElementById(name);
        nameElement.style.backgroundColor= sameDay(latestDate, new Date()) ?
            '#0c875a' :
            '#286aa8';
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

function appendData(key,value) {
    var data = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(data)) {
        data.push(value);
        storeData(key,data)
    }
}


/* write parse new topic text*/
function parseUserInput() {
    return "todo"
}

/* retrieves text from textField and creates a new button.
appropriately handles no text or duplicate topics
*/ 
function newTopic() {
    var topic = document.getElementById("new-topic").value
    if (topic === "") {
        return;
    }
    // check if button with that name already exists
    if (retrieveData(topic) === null) {
        storeData(topic,[]);
        appendData("TOPIC-NAME-DATA",topic)
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
            const date = new Date(dateStr);
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
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}

function deleteTopic() {
    const topic_name = prompt("Type in the topic name you would like to delete")
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

function downloadCSV() {
    var encodedUri = encodeURI(toCSV());
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
}

function toCSV() {
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Topic,Date\r\n"
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    topicNameData.forEach(function(topic) {
        var dates = retrieveData(topic)
        dates.forEach(function(date) {
            csvContent += `${topic},${date}\r\n`;
        })
    })
    return csvContent
}