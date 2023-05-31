const titleInput = document.querySelector(".title");
const taskInput = document.querySelector(".text");
const dateInput = document.querySelector(".date");
const timeInput = document.querySelector(".time");
const submitBtn = document.querySelector(".submit-btn");
const notesDisplayContainer = document.querySelector(".note-container");
const deletedNotesContainer = document.querySelector(".deleted-note-container");
const archieveNotesContainer = document.querySelector(".archieve-note-container");
const sortBtn = document.querySelector(".sort");
let isEdit = false;
let editId;
let editCard;

document.addEventListener("DOMContentLoaded", () => {
    let notes = localStorage.getItem("notes");
    notesObj = JSON.parse(notes);
    displayLocalStorage(notesObj);
    showDeletedNotes();
    showArchieveNotes();
    updateReminders();
});

function submitForm(e) {
    e.preventDefault();
    if (isEdit) {
        editCard.children[0].textContent = titleInput.value;
        editCard.children[1].textContent = taskInput.value;
        editCard.children[2].textContent = `Complete By : ${dateInput.value}`;
        editCard.children[3].textContent = `Time : ${timeInput.value}`;
        addToLocalStorage();
        titleInput.value = "";
        taskInput.value = "";
        dateInput.value = "";
        timeInput.value = "";
        return;
    }
    if (!titleInput.value || !taskInput.value || !dateInput.value || !timeInput.value) {
        console.log("Enter all details");
        // return;
    }
    const id = new Date().getTime();
    const title = titleInput.value;
    const task = taskInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    addToLocalStorage(title, task, date,time, id);
    appendNote(title, task, date, time, id);
    titleInput.value = "";
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
}

function addToLocalStorage(title, task, date,time, id) {
    let notes = localStorage.getItem("notes");
    if (notes === null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }
    if (isEdit) {
        isEdit = false;
        Array.from(notesObj).forEach(note => {
            if (note.id === Number.parseInt(editId)) {
                note.title = editCard.children[0].textContent;
                note.task = editCard.children[1].textContent;
                note.date = editCard.children[2].textContent.slice(14);
                note.time = editCard.children[3].textContent.slice(7);
            }
        })
    }
    else {
        notesObj.push({
            title: title,
            task: task,
            date: date,
            id: id,
            time: time,
            reminder: false
        })
    }
    localStorage.setItem("notes", JSON.stringify(notesObj));
}

function displayLocalStorage(notesObj) {
    if (notesObj === null) return;
    Array.from(notesObj).forEach(note => {
        appendNote(note.title, note.task, note.date,note.time, note.id);
    });
}

// adding a note function
function appendNote(title, task, date, time, id) {
    const card = document.createElement("div");
    card.setAttribute('class', "card your-note");
    card.dataset.id = id;
    card.innerHTML = `
    <h3 class="note-title">${title}</h3>
    <div class="note-text">${task}</div>
    <div class="due-date">Complete By : ${date}</div>
    <div class="due-time">Time : ${time}</div>
    <div class="features">
        <button class="btn-sm edit" data-id=${id}>Edit</button><button class="btn-sm delete" data-id=${id}>Delete</button><button class="btn-sm archieve" data-id=${id}>Archieve</button>
        <i class="fa-regular fa-bell reminder" data-id=${id}></i>
    </div>
    `
    notesDisplayContainer.appendChild(card);

    const deleteBtns = notesDisplayContainer.querySelectorAll(".delete");
    const editBtns = notesDisplayContainer.querySelectorAll(".edit");
    const archieveBtns = notesDisplayContainer.querySelectorAll(".archieve");
    const reminderBtns = notesDisplayContainer.querySelectorAll(".reminder");

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", deleteNote);
    })

    archieveBtns.forEach(btn => {
        btn.addEventListener("click", archieveNote);
    })

    editBtns.forEach(btn => {
        btn.addEventListener("click", editNote);
    })

    reminderBtns.forEach(btn => {
        btn.addEventListener("click", addReminder);
    })
}

// add reminder function
function addReminder() {
    const parent = this.parentElement.parentElement;
    const taskId = parent.dataset.id;
    const title = parent.children[0].textContent;
    const inputDate = parent.children[2].textContent.slice(14);
    const inputTime = parent.children[3].textContent.slice(7);
    const dueYear = Number.parseInt(inputDate.slice(0, 4));
    const dueMonth = Number.parseInt(inputDate.slice(5, 7));
    const dueDate = Number.parseInt(inputDate.slice(8));
    const dueHour = Number.parseInt(inputTime.slice(0,2));
    const dueMin = Number.parseInt(inputTime.slice(3));
    console.log(dueYear,dueMonth,dueDate);
    const setDueTime = new Date();
    setDueTime.setFullYear(dueYear);
    setDueTime.setMonth(dueMonth-1);
    setDueTime.setDate(dueDate);
    setDueTime.setHours(dueHour);
    setDueTime.setMinutes(dueMin);
    const dueTime = setDueTime.getTime();
    // new Date(year, monthIndex, day, hours, minutes, seconds)
    const presentTime = new Date().getTime();
    const timeDiff = dueTime - presentTime;
    console.log(timeDiff);
    if (isReminderSet(taskId)) {
        alert("Reminder is already set");
        return;
    }
    setReminderOn(taskId);
    setReminderLocalStorage(title, taskId, dueTime);
    showReminders(title,taskId,timeDiff,timeDiff);
}

function setReminderLocalStorage(title, id, dueTime) {
    const reminderData = localStorage.getItem("reminder");
    let reminderDataObj = [];
    if (reminderData != null) {
        reminderDataObj = JSON.parse(reminderData);
    }
    reminderDataObj.push({
        title: title,
        id: id,
        time: dueTime
    })

    localStorage.setItem('reminder', JSON.stringify(reminderDataObj));
}

function setReminderOn(id) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    let taskToBeModified;
    Array.from(notes).forEach(note => {
        if (note.id === Number.parseInt(id)) {
            taskToBeModified = note;
        }
    })
    notes[notes.indexOf(taskToBeModified)].reminder = true;
    localStorage.setItem("notes", JSON.stringify(notes));
}

function isReminderSet(id) {
    const notes = JSON.parse(localStorage.getItem("notes"));
    const parent = Array.from(notes).filter(note => {
        if (note.id === Number.parseInt(id)) {
            return note;
        }
    })
    return parent[0].reminder;
}

function removeCompletedReminders(id) {
    const reminderData = JSON.parse(localStorage.getItem("reminder"));
    const modifiedArray = Array.from(reminderData).filter(reminder => {
        return Number.parseInt(reminder.id) != id;
    })
    localStorage.setItem('reminder', JSON.stringify(modifiedArray));
}

function updateReminders(){
    const reminderData = localStorage.getItem("reminder");
    let reminderDataObj = [];
    if(reminderData != null){
        reminderDataObj = JSON.parse(reminderData);
    }
    Array.from(reminderDataObj).forEach(reminder => {
        const presentTime = new Date().getTime();
        const dueTime = reminder.time;
        const timeDiff = dueTime - presentTime;
        const title = reminder.title;
        const taskId = reminder.id;
        showReminders(title,taskId,timeDiff);
    })
}

function showReminders(title,id,time){
    setTimeout(() => {
        alert(`Your task ${title} is due.`);
        removeCompletedReminders(id);
    }, time);
}
// edit note function
function editNote() {
    isEdit = true;
    let parent = this.parentElement.parentElement;
    let title = parent.children[0].textContent;
    let task = parent.children[1].textContent;
    let date = parent.children[2].textContent.slice(14);
    let time = parent.children[3].textContent.slice(7);
    editId = parent.dataset.id
    titleInput.value = title;
    taskInput.value = task;
    dateInput.value = date;
    timeInput.value = time;
    editCard = parent;
}

function updateLocalStorage(editId){

}

// archieve note function
function archieveNote(e) {
    let parent = this.parentElement.parentElement;
    let notes = JSON.parse(localStorage.getItem("notes"));
    let archNoteData = {};
    const modifiedArray = Array.from(notes).filter(note => {
        if (note.id === Number.parseInt(parent.dataset.id)) {
            archNoteData = {
                title: note.title,
                task: note.task,
                date: note.date,
                time: note.time,
                id: note.id
            }
        }
        return note.id != parent.dataset.id;
    })
    localStorage.setItem("notes", JSON.stringify(modifiedArray));
    notesDisplayContainer.removeChild(parent);
    setArchieveLocalStorage(archNoteData);
}

function setArchieveLocalStorage(archNoteData) {
    let archNotes = localStorage.getItem("delNotes");
    let archNoteObj = [];
    if (archNotes !== null) {
        archNoteObj = JSON.parse(archNotes);
    }
    archNoteObj.push(archNoteData);
    localStorage.setItem("archNotes", JSON.stringify(archNoteObj));
    archNoteObj = JSON.parse(archNotes);
    appendArchNotes(archNoteData.title, archNoteData.task, archNoteData.date, archNoteData.time, archNoteData.id);
}

function appendArchNotes(title, task, date, time, id) {
    const card = document.createElement("div");
    card.setAttribute('class', "card your-note");
    card.dataset.id = id;
    card.innerHTML = `
    <h3 class="note-title">${title}</h3>
    <div class="note-text">${task}</div>
    <div class="due-date">Archived</div>
    <div class="features">
        <button class="btn-sm primary undo">Undo</button>
    </div>
    `
    archieveNotesContainer.appendChild(card);

    const undoBtns = archieveNotesContainer.querySelectorAll(".undo");
    undoBtns.forEach(btn => btn.addEventListener("click", undoArchieveTask));
}

function showArchieveNotes() {
    let archNotes = localStorage.getItem("archNotes");
    let archNoteObj = [];
    if (archNotes !== null) {
        archNoteObj = JSON.parse(archNotes);
    }
    Array.from(archNoteObj).forEach(archNote => {
        appendArchNotes(archNote.title, archNote.task, archNote.date, archNote.time, archNote.id);
    })
}

// delete note function
function deleteNote(e) {
    let parent = this.parentElement.parentElement;
    let notes = JSON.parse(localStorage.getItem("notes"));
    let delNoteData = {};
    const modifiedArray = Array.from(notes).filter(note => {
        if (note.id === Number.parseInt(parent.dataset.id)) {
            delNoteData = {
                title: note.title,
                task: note.task,
                date: note.date,
                time: note.time,
                id: note.id
            }
        }
        return note.id !== Number.parseInt(parent.dataset.id);
    })
    localStorage.setItem("notes", JSON.stringify(modifiedArray));
    notesDisplayContainer.removeChild(parent);
    setDeletedLocalStorage(delNoteData);
}

function setDeletedLocalStorage(delNoteData) {
    let delNotes = localStorage.getItem("delNotes");
    let delNoteObj = [];
    if (delNotes !== null) {
        delNoteObj = JSON.parse(delNotes);
    }
    delNoteObj.push(delNoteData);
    localStorage.setItem("delNotes", JSON.stringify(delNoteObj));
    delNoteObj = JSON.parse(delNotes);
    appendDelNote(delNoteData.title, delNoteData.task, delNoteData.date, delNoteData.time, delNoteData.id);
}

function showDeletedNotes() {
    let delNotes = localStorage.getItem("delNotes");
    let delNoteObj = [];
    if (delNotes !== null) {
        delNoteObj = JSON.parse(delNotes);
    }
    Array.from(delNoteObj).forEach(delNote => {
        appendDelNote(delNote.title, delNote.task, delNote.date, delNote.time, delNote.id);
    })
}

function appendDelNote(title, task, date, time, id) {
    const card = document.createElement("div");
    card.setAttribute('class', "card your-note");
    card.dataset.id = id;
    card.innerHTML = `
    <h3 class="note-title">${title}</h3>
    <div class="note-text">${task}</div>
    <div class="due-date">Deleted</div>
    <div class="features">
        <button class="btn-sm danger undo">Undo</button>
    </div>
    `
    deletedNotesContainer.appendChild(card);

    const undoBtns = deletedNotesContainer.querySelectorAll('.undo');
    undoBtns.forEach(btn => btn.addEventListener("click", undoDeletedTask));
}

function undoDeletedTask() {
    let parent = this.parentElement.parentElement;
    let delNotes = localStorage.getItem("delNotes");
    let delNoteObj = [];
    if (delNotes !== null) {
        delNoteObj = JSON.parse(delNotes);
    }
    const modifiedArray = Array.from(delNoteObj).filter(note => {
        if (note.id === Number.parseInt(parent.dataset.id)) {
            addToLocalStorage(note.title, note.task, note.date, note.time, note.id);
            appendNote(note.title, note.task, note.date, note.time, note.id);
        }
        return note.id !== Number.parseInt(parent.dataset.id);
    })
    localStorage.setItem("delNotes", JSON.stringify(modifiedArray));
    deletedNotesContainer.removeChild(parent);
}

function undoArchieveTask() {
    let parent = this.parentElement.parentElement;
    let archNotes = localStorage.getItem("archNotes");
    let archNoteObj = [];
    if (archNotes !== null) {
        archNoteObj = JSON.parse(archNotes);
    }
    const modifiedArray = Array.from(archNoteObj).filter(note => {
        if (note.id === Number.parseInt(parent.dataset.id)) {
            addToLocalStorage(note.title, note.task, note.date, note.time, note.id);
            appendNote(note.title, note.task, note.date, note.time, note.id);
        }
        return note.id !== Number.parseInt(parent.dataset.id);
    })
    localStorage.setItem("archNotes", JSON.stringify(modifiedArray));
    archieveNotesContainer.removeChild(parent);
}

function sortNotes(){
    let notes = localStorage.getItem("notes");
    let notesObj = [];
    if(notes != null){
        notesObj = JSON.parse(notes);
    }
    notesObj.sort((a,b) => {
        let aTime = Number.parseInt(getDueTime(a.date,a.time));
        let bTime = Number.parseInt(getDueTime(b.date,b.time));
        if(aTime > bTime) return 1;
        else if(aTime <= bTime) return -1;
    });
    displaySortedData(notesObj);
}

function displaySortedData(notesObj){
    notesDisplayContainer.innerHTML = "";
    Array.from(notesObj).forEach(note => {
        const card = document.createElement("div");
        card.setAttribute('class', "card your-note");
        card.dataset.id = note.id;
        card.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <div class="note-text">${note.task}</div>
        <div class="due-date">Complete By : ${note.date}</div>
        <div class="due-time">Time : ${note.time}</div>
        <div class="features">
            <button class="btn-sm edit" data-id=${note.id}>Edit</button><button class="btn-sm delete" data-id=${note.id}>Delete</button><button class="btn-sm archieve" data-id=${note.id}>Archieve</button>
            <i class="fa-regular fa-bell reminder" data-id=${note.id}></i>
        </div>
        `
        notesDisplayContainer.appendChild(card);
    })

    const deleteBtns = notesDisplayContainer.querySelectorAll(".delete");
    const editBtns = notesDisplayContainer.querySelectorAll(".edit");
    const archieveBtns = notesDisplayContainer.querySelectorAll(".archieve");
    const reminderBtns = notesDisplayContainer.querySelectorAll(".reminder");

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", deleteNote);
    })

    archieveBtns.forEach(btn => {
        btn.addEventListener("click", archieveNote);
    })

    editBtns.forEach(btn => {
        btn.addEventListener("click", editNote);
    })

    reminderBtns.forEach(btn => {
        btn.addEventListener("click", addReminder);
    })
}

function getDueTime(dateStr,timeStr){
    const dueYear = Number.parseInt(dateStr.slice(0, 4));
    const dueMonth = Number.parseInt(dateStr.slice(5, 7));
    const dueDate = Number.parseInt(dateStr.slice(8));
    const dueHour = Number.parseInt(timeStr.slice(0,2));
    const dueMin = Number.parseInt(timeStr.slice(3));
    const dueTime = new Date(dueYear, dueMonth-1, dueDate,dueHour,dueMin).getTime();
    return dueTime;
}

submitBtn.addEventListener("click", submitForm);
sortBtn.addEventListener("click",sortNotes);