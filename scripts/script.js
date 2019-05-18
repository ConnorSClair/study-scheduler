// temporary - remove data on load
localStorage.removeItem("test")

function submitTopic() {
    var name = document.getElementById("new-topic").value
    if (name == "") {
        alert("Couldn't see any text")
        return 
    }
    // check if button with that name already exists, if not:
    if (localStorage.getItem(name) == null) {
        // create new button
        var dates_data = JSON.stringify([]);
        localStorage.setItem(name,dates_data);
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
    for (let dateStr of dates) {
        // convert date string to Date and check if already studied today
        date = new Date(dateStr)
        if (sameDay(today,date)) {
            return
        }
    }
    dates.push(today);
    localStorage.setItem(name, JSON.stringify(dates))
}

function getStudyDates() {
    var name = "test";
    var dates = JSON.parse(localStorage.getItem(name));
    for (let item of dates) console.log(item);
}

function sameDay(d1, d2) {
    return d1.getFullYear() == d2.getFullYear() &&
      d1.getMonth() == d2.getMonth() &&
      d1.getDate() == d2.getDate();
  }