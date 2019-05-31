/* Called when website is opened. Loads data from previous sessions using localStorage API */
function on_load() {
    google.charts.load('current', {'packages':['table']});
    
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    if (topicNameData === null) {
        topicNameData = []
        storeData("TOPIC-NAME-DATA",topicNameData)
    }
    for (i = 0; i < topicNameData.length; i++) {
        var name = topicNameData[i];
        // create_button(name);
        createTopicWidget(name);
        colorise_button(name);
        updateInfo(name);
    }
}

function updateInfo(name) {
    var info = $(`#${name}-info`)[0];
    const currentStreak = getCurrentStreak(name);
    const daysUntilNextSession = daysLeft(name);
    const studiedDaysAgo = lastStudied(name);
    info.innerHTML = `<b>Streak: </b>${currentStreak}<br><b>Next Session:</b> in ${daysUntilNextSession} days<br><b>Last Studied:</b> ${studiedDaysAgo}`;
}

function getCurrentStreak(name) {
    return 3
}
function daysLeft(name) {
    return 5
}
function lastStudied(name) {
    var dates = retrieveData(name);
    if (dates != null && dates.length > 0) {
        const today = new Date();
        const lastStudied = new Date(dates[dates.length - 1]);
        if (sameDay(today,lastStudied)) {
            return "today";
        } else {
            const diffDays = diffDates(today,lastStudied)
            return `${diffDays} days ago`;
        }
    }
    return "never"
}

/* create any button. Used on load as well as used when new study topic
*/  

/* 
                        <div class = "topic-widget">
                            <button class = "topic-button">Concurrency</button>
                            <p class = "topic-info">Streak: 7 Days<br>Next Session: Today</p>
                        </div>
*/

/* Whenever a widget needs to be drawn to the screen */
function createTopicWidget(name) {
    // create elements
    var topicWidget = document.createElement("DIV");
    var topicButton = document.createElement("BUTTON");
    var topicInfo = document.createElement("P");

    // create Ids
    const widgetId = name + "-widget";
    const buttonId = name // + "-button";
    const infoId = name + "-info";
    
    // solve for streak
    // solve for last studied 
    //streak = 
    //lastStudied = 

    // set attributes
    topicWidget.setAttribute("id",widgetId);
    topicWidget.setAttribute("class","topic-widget");
    topicButton.setAttribute("id", buttonId);
    topicButton.setAttribute("class","topic-button");
    topicButton.setAttribute("onclick","studied(this)");
    topicButton.innerHTML = name;
    topicInfo.setAttribute("id",infoId);
    topicInfo.setAttribute("class","topic-info");
    topicInfo.innerHTML = "Streak: TODO<br>Next Session: TODO";

    // add button and info to div container
    topicWidget.appendChild(topicButton);
    topicWidget.appendChild(topicInfo);
    // add div container to correct column
    document.getElementById("later").appendChild(topicWidget);
    
    /*

    button.style.width = "120px"
    
    button_div.style.cssText = "flex-direction: row; display: inline-block; display: flex; margin: auto";
    var text = document.createElement("p")
    text.style.cssText = "flex-direction: row; display: inline-block";
    text.innerHTML = "Streak: 7<br> Last Studied: 3 days ago"
    button_div.id = name + "Div"
    button.innerHTML = name;
    button.id = name;
    document.getElementById("buttons").appendChild(button_div)
    button_div.appendChild(button)
    button_div.appendChild(text)
    */
}

function create_button(name) {
    var button = document.createElement("BUTTON");
    button.innerHTML = name;
    button.id = name;
    return button;
    

}

/* given a button that exists, colorise based on streak logic
*/
function colorise_button(name) {
    // simple first. studied today then green, otherwise grey
    if (name != "") {
        var dates = retrieveData(name)
        const topicWidget = document.getElementById(name + "-widget");
        button = $(`#${name}-widget`).find(":button")[0]
        if (dates.length === 0) {
            button.style.backgroundColor = "grey";
            
        } else {
            // assumes ordered from smallest to largest (latest date is at end of list)
            const latestDate = new Date(dates[dates.length - 1]) 
            button.style.backgroundColor= sameDay(latestDate, new Date()) ?
                '#0c875a' :
                '#286aa8';
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
    var topicName = document.getElementById("new-topic").value
    if (topicName === "") {
        return;
    }
    // check if button with that name already exists
    if (retrieveData(topicName) === null) {
        storeData(topicName,[]);
        appendData("TOPIC-NAME-DATA",topicName)
        createTopicWidget(topicName);
        colorise_button(topicName);
        updateInfo(topicName)

    } else {
        alert("Topic with that name already exists")
    }
}

/* on button press
*/ 
function studied(button) {
    var name = button.id

    
    var dates = retrieveData(name);
    if (dates != null) {
        const today = new Date();
        const lastStudied = new Date(dates[dates.length - 1]);
        if (sameDay(today,lastStudied)) {
            dates.pop();
        } else {
            dates.push(today);
        }        
        storeData(name,dates);
        colorise_button(name);
        updateInfo(name)
    }
    
}
/* Expects two date types*/
function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}
function diffDates(d1, d2) {
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
}





function deleteTopic() {
    const topic_name = prompt("Type in the topic name you would like to delete");
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    const loc = topicNameData.indexOf(topic_name)
    if (loc >= 0) {
        if (retrieveData(topic_name) != null) {
            topicNameData = topicNameData.filter(topic => topic !== topic_name)
            storeData("TOPIC-NAME-DATA",topicNameData)
            localStorage.removeItem(topic_name);
            var button = document.getElementById(topic_name)
            document.getElementById("buttons").removeChild(button)
        }
    }
}

function deleteAllData() {
    const check = prompt("Type 'DELETE ALL' to delete all user data");
    if (check === "DELETE ALL") {
        var topicNameData = retrieveData("TOPIC-NAME-DATA");
        for (var i = 0; i < topicNameData.length; i++) {
            var name = topicNameData[i]
            var button = document.getElementById(name)
            document.getElementById("buttons").removeChild(button)
            localStorage.removeItem(name)
        }
        localStorage.removeItem("TOPIC-NAME-DATA")
        on_load()
    }
}

function downloadCSV() {
    var encodedUri = encodeURI(toCSVExpandedDates(true));
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
}

function displayData() {
    const tableDivReference = document.getElementById('table-div')
    var tableReference = document.getElementsByClassName('google-visualization-table')
    if (tableReference.length > 0) {
        tableDivReference.removeChild(tableReference[0])
    } else{
        var csvData = toCSVExpandedDates(false);
        var arrayData = $.csv.toArrays(csvData,{onParseValue: $.csv.hooks.castToScalar});
        var dataTable = new google.visualization.arrayToDataTable(arrayData);
        var table = new google.visualization.Table(document.getElementById('table-div'));
        table.draw(dataTable, {showRowNumber: false, page: 'enable', pageSize: 20, width: '100%', height: '100%'});
    }
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

function toCSVExpandedDates(download) {
    if (download) {
        var csvContent = "data:text/csv;charset=utf-8,";
    } else {
        var csvContent = "";
    }
    csvContent += "Topic,Year,Month,Day\r\n"
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    topicNameData.forEach(function(topic) {
        var dates = retrieveData(topic)
        dates.forEach(function(dateStr) {
            var date = new Date(dateStr);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            csvContent += `${topic},${year},${month},${day}\r\n`;
        })
    })
    return csvContent
}