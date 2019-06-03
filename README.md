# study_scheduler
Simple, client side, to-do list application that encourages users to study using spaced repetition
## Description
Submit, track and analyze personal study topic data through time. Increase your study streak by studying on successive days and be rewarded with longer times between sessions as you build up your streak - e.g. a streak of 3 days entitles you to a 2 day break.
Your data is saved locally to the device and can be downloaded at any time.


## Documentation
### Study Topics
- Submit new study topics by entering text in the text area in the action menu at the top. 
- Indicate study by simply clicking the relevant topic widget (undo by clicking again) 
- Delete topics by clicking the 'Delete Topic' option and naming the relevant topic (all data for this topic will be removed and cannot be undone!)
### Study Streaks
- For each day you indicate your study of a topic you increase your streak by 1. As you study increase your streak, topics will be moved to the "Tomorrow" and "Later" columns - you won't lose your streak if you don't study these on that day. 
### Data
- Open a table of your recorded study sessions at the bottom of the page by pressing the 'Tabulate Data' button (close by clicking again)
- Download your data as a CSV file (openable in Excel, Google Sheets and other data manipulation applications) by clicking the 'Download Data' button
- Delete all data by clicking the 'Delete All Data' button (all data for this topic will be removed and cannot be undone!)



## Goals
- [x] Create new study topics 
- [x] Stored user data between browsing sessions 
- [x] Click button to indicate the day when you studied this topic (green = studied, grey = not studied)
- [ ] Implement streak logic (spaced study sessions)
- [x] Allow user to download data
- [x] Allow user to delete data / delete a particular study topic / edit topic names

## Bugs/issues
- [ ] Prevent duplicate topics made by substituting character case (e.g. "math" and "Math")
- [ ] Text needs to scale with button size, or a cap on text length needs to be implemented 
- [x] Current use of localStorage API needs to be improved (iterating over all localStorage right now)
