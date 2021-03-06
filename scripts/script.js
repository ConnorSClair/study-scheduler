/* Called when website is refreshed. Sets things up. Loads data from previous sessions using localStorage API */
function on_load() {
    google.charts.load('current', {'packages':['table']});

    document.querySelector("#new-topic").addEventListener("keyup", event => {
        if(event.key !== "Enter") return; // Use `.key` instead.
        document.querySelector("#submit-new-topic").click(); // Things you want to do.
        event.preventDefault(); // No need to `return false;`.
    });
    
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    if (topicNameData === null) {
        topicNameData = []
        storeData("TOPIC-NAME-DATA",topicNameData)
    }
    for (i = 0; i < topicNameData.length; i++) {
        var name = topicNameData[i];
        refreshTopicWidget(name);
        colorise_button(name);
        updateInfo(name);
    }
}

function updateInfo(topicName) {
    var topicNameInfoId = $(`#${topicName}-info`)[0];
    const currentStreak = getCurrentStreak(topicName);
    const daysUntilNextSession = daysLeft(topicName);
    //const studiedDaysAgo = lastStudied(topicName);
    const _daysSinceStudied = daysSinceStudied(topicName);
    var lastStudied;
    if (_daysSinceStudied === -1) {
        lastStudied = "never"
    } else if (_daysSinceStudied === 0) {
        lastStudied = "today"
    } else {
        lastStudied = `${_daysSinceStudied} days ago`
    }
    topicNameInfoId.innerHTML = `<b>Streak: </b>${currentStreak}<br><b>Next Session:</b> in ${daysUntilNextSession} days<br><b>Last Studied:</b> ${lastStudied}`;
}

/* Given a String topicName returns int representing the current study streak  */ 
function getCurrentStreak(topicName) {
    var dates = retrieveData(topicName);
    if (dates != null && dates.length > 0) {
        var streak = 1;
        var day = getDay(new Date(dates[0]));
        var expectedDay = day + streak;
        for (let i = 1; i < dates.length; i++) {
            var nextDay = getDay(new Date(dates[i]));
            if (nextDay === expectedDay) {
                streak += 1;
                day = nextDay;
                expectedDay = day + streak;
            } else if (nextDay < expectedDay) {
                // restart days left
                day = nextDay;
                expectedDay = day + streak;
            } else {
                // missed a day, streak back to 1
                streak = 1;
                day = nextDay;
                expectedDay = day + streak;
            }
        }
        // check today 
        var today = getDay(new Date());
        if (today <= expectedDay) {
            return streak;
        } else {
            // missed a day
            return 0;
        }
    }
    // never studied
    return 0;
}

/* Given a String topicName returns int representing the number of days left until the next study session
e.g. 0 means study today, 1 means study tomorrow and so on */ 
function daysLeft(topicName) {
    var dates = retrieveData(topicName);
    streak = getCurrentStreak(topicName);
    if (dates != null && dates.length > 0) {
        var lastStudied = getDay(new Date(dates[dates.length - 1]));
    } else {
        // never studied
        return 0;
    }
    var today = getDay(new Date());
    // studied 1 + streak of 3, expect 4 and current is 2 
    var diff = (lastStudied + streak) - today;
    if (diff < 0) {
        return 0;
    } else {
        return diff;
    }
}

/* Returns days since last studied, 0 if studied today, -1 if never studied, 1 if studied yesterday*/ 
function daysSinceStudied(topicName) {
    var dates = retrieveData(topicName);
    if (dates != null && dates.length > 0) {
        const today = new Date();
        const lastStudied = new Date(dates[dates.length - 1]);
        return getDay(today) - getDay(lastStudied);
    } else {
        return -1;
    }
}

/* Whenever a widget needs to be drawn to the screen */
function refreshTopicWidget(name) {
    // create elements
    var topicWidget = document.createElement("DIV");
    var topicButton = document.createElement("BUTTON");
    var topicInfo = document.createElement("P");

    // create Ids
    const widgetId = name + "-widget";
    const buttonId = name // + "-button";
    const infoId = name + "-info";

    // set attributes
    topicWidget.setAttribute("id",widgetId);
    topicWidget.setAttribute("class","topic-widget");

    topicButton.setAttribute("id", buttonId);
    topicButton.setAttribute("class","topic-button");
    topicButton.setAttribute("onclick","studied(this)");
    topicButton.innerHTML = idToName(name);

    topicInfo.setAttribute("id",infoId);
    topicInfo.setAttribute("class","topic-info");

    // add button and info to div container
    topicWidget.appendChild(topicButton);
    topicWidget.appendChild(topicInfo);
    // add div container to correct column
    var columnName; 
    if (daysLeft(name) === 0) {
        columnName = "today-column"
    } else if (daysSinceStudied(name) === 0) {
        columnName = "today-column"
    } else if (daysSinceStudied(name) === 1) {
        columnName = "tomorrow-column"
    } else {
        columnName = "later-column"
    }
    document.getElementById(columnName).appendChild(topicWidget);
}


/* given a button that exists, colorise based on streak logic */
function colorise_button(name) {
    if (name != "") {
        var dates = retrieveData(name)
        const topicWidget = document.getElementById(name + "-widget");
        button = $(`#${name}-widget`).find(":button")[0]
        if (dates.length === 0) {
            button.style.backgroundColor = '#286aa8';
        } else {
            // assumes ordered from smallest to largest (latest date is at end of list)
            const latestDate = new Date(dates[dates.length - 1]) 
            button.style.backgroundColor= sameDay(latestDate, new Date()) ?
                '#0c875a':
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

/* todo: this is bad. write parse new topic text*/
function parseUserInput(str) {
    str = str.replace(/ /g, "-");
    return str
}

function idToName(str) {
    return str.replace(/-/g, " ");
}

/* retrieves text from textField and creates a new button.
appropriately handles no text or duplicate topics
*/ 
function newTopic() {
    var topicName = document.getElementById("new-topic").value
    if (topicName === "") {
        return;
    }
    if (/^[a-zA-Z ]+$/.test(topicName)) {
        topicName = parseUserInput(topicName);
        // check if button with that name already exists
        if (retrieveData(topicName) === null) {
            storeData(topicName,[]);
            appendData("TOPIC-NAME-DATA",topicName)
            refreshTopicWidget(topicName);
            colorise_button(topicName);
            updateInfo(topicName)
            $("#new-topic")[0].value = '';
        } else {
            alert("Topic with that name already exists")
        }
    } else {
        alert("Topic name may only contain letters and spaces")
    }
}

/* on button press */ 
function studied(button) {
    var name = button.id;
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
        updateInfo(name);
    }
    
}
/* Expects two date types (todo: replace this with diffDates) */
function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}
function diffDates(d1, d2) {
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
}

function getDay(date) {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24)); 
}

function deleteTopic() {
    var name = prompt("Type in the topic name you would like to delete");
    name = parseUserInput(name);
    var topicNameData = retrieveData("TOPIC-NAME-DATA");
    const loc = topicNameData.indexOf(name)
    if (loc >= 0) {
        if (retrieveData(name) != null) {
            topicNameData = topicNameData.filter(topic => topic !== name)
            storeData("TOPIC-NAME-DATA",topicNameData)
            localStorage.removeItem(name);
            var widget = document.getElementById(`${name}-widget`)
            widget.parentElement.removeChild(widget)
        }
    }
}

function deleteAllData() {
    const check = prompt("Type 'DELETE ALL' to delete all user data");
    if (check === "DELETE ALL") {
        var topicNameData = retrieveData("TOPIC-NAME-DATA");
        for (var i = 0; i < topicNameData.length; i++) {
            var name = topicNameData[i]
            var widget = document.getElementById(`${name}-widget`)
            widget.parentElement.removeChild(widget)
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