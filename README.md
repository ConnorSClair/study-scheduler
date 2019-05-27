# study_scheduler
Simple, client side, to-do list application that encourages users to study using spaced repetition
## Features 
- [x] Create new study topic buttons 
- [x] Stored user data between browsing sessions 
- [x] Click button to indicate the day when you studied this topic (green = studied, grey = not studied)
- [ ] Implement streak logic (spaced study sessions)
- [x] Allow user to download data
- [ ] Allow user to delete data / delete a particular study topic / edit topic names

## Bugs/issues
- [ ] Prevent duplicate topics made by substituting character case (e.g. "math" and "Math")
- [ ] Text needs to scale with button size, or a cap on text length needs to be implemented 
- [ ] Current use of localStorage API needs to be improved (iterating over all localStorage right now)
