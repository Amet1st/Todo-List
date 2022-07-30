const todoList = document.getElementById('currentTasks');
const completedList = document.getElementById('completedTasks');
const form = document.querySelector('form');

const editLabel = document.getElementById('exampleModalLabel');
const inputTitle = document.getElementById('inputTitle');
const inputText = document.getElementById('inputText');
const priorityInputs = document.querySelectorAll('input[type="radio"]');
const inputColor = document.getElementById('inputColor');

const submitButton = document.getElementById('add');
const sortNewButton = document.getElementById('sortNew');
const sotrOldButton = document.getElementById('sortOld');
const nightButton = document.getElementById('night');

let taskToEdit;
let taskCounter;
let completeCounter;

document.addEventListener('DOMContentLoaded', getTasks);
document.addEventListener('DOMContentLoaded', showCounters);
document.addEventListener('DOMContentLoaded', getNightMode);

todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-success')) {
        completeTask(event);
    }

    if (event.target.classList.contains('btn-info')) {
        editTask(event);
    }

    if (event.target.classList.contains('btn-danger')) {
        deleteTask(event)
    }
})

completedList.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-danger')) {
        deleteTask(event);
    }
}); 

form.addEventListener('submit', (event) => {
    
    if (submitButton.textContent === "Add task") {
        submitFormAdd(event);
    }

    if (submitButton.textContent === "Edit task") {
        submitFormEdit(event);
    }
});

sortNewButton.addEventListener('click', (event) => {
    sortTasks(false);
});

sotrOldButton.addEventListener('click', (event) => {
    sortTasks(true);
});

nightButton.addEventListener('click', activateNightMode);

function completeTask(event) {

    const task = event.target.closest('li');

    todoList.previousElementSibling.innerHTML = "ToDo (" + --taskCounter + ")";
    completedList.previousElementSibling.innerHTML = "Completed (" + ++completeCounter + ")";

    let taskDescription = JSON.parse(localStorage.getItem(task.dataset.id));

    taskDescription.isDone = true;

    localStorage.setItem(taskDescription.id, JSON.stringify(taskDescription));

    task.remove();

    const completedTaskHTML = createTaskHTML(taskDescription);

    completedList.insertAdjacentHTML('beforeend', completedTaskHTML);
}

function editTask(event) {

    const task = event.target.closest('li');

    $("#exampleModal").modal("show");

    taskToEdit = task;

    const taskID = task.dataset.id;

    const taskDescription = JSON.parse(localStorage.getItem(taskID));

    fillEditForm(taskDescription);

    submitButton.textContent = "Edit task";

    editLabel.textContent = "Edit task";

}

function deleteTask(event) {

    const task = event.target.closest('li');

    if (task.closest('#currentTasks')) {
        todoList.previousElementSibling.innerHTML = "ToDo (" + --taskCounter + ")";
    } else {
        completedList.previousElementSibling.innerHTML = "Completed (" + --completeCounter + ")";
    }
    
    localStorage.removeItem(task.dataset.id);

    task.remove();
}

function submitFormEdit(event) {

    event.preventDefault();
        
    const task = taskToEdit;

    const title = task.querySelector('.mb-1');
    title.textContent = inputTitle.value;

    const text = task.querySelector('p');
    text.textContent = inputText.value;

    let priorityHTML = task.querySelector('small');
    let priority;

    priorityInputs.forEach(item => {
        if (item.checked) {
            priority = item.value;
            priorityHTML.textContent = item.value + " priority";
        }
    })

    const time = getDateOfAdd();
    const timeOfAdd = (new Date()).getTime();
    task.timeOfAdd = timeOfAdd;

    const dateElement = task.querySelector('.date');
    dateElement.textContent = time;

    const color = inputColor.value;
    task.style.backgroundColor = color;
    const fontColor = getFontColor(inputColor.value);
    task.style.color = fontColor;

    const taskDescription = {
        "id": task.dataset.id,
        "title": title.textContent,
        "text": text.textContent,
        "priority": priority,
        "color": color,
        "time": time,
        "timeOfAdd": timeOfAdd,
        "fontColor": fontColor
    }

    localStorage.setItem(task.dataset.id, JSON.stringify(taskDescription));

    form.reset();

    submitButton.textContent = "Add task";

    editLabel.textContent = "Add task";

    $("#exampleModal").modal("hide");

}

function submitFormAdd(event) {

    event.preventDefault();

    todoList.previousElementSibling.innerHTML = "ToDo (" + ++taskCounter + ")";

    const title = inputTitle.value;
    const text = inputText.value;
    const time = getDateOfAdd();
    const timeOfAdd = (new Date()).getTime();
    const taskID = generateId();
    const color = inputColor.value;
    const fontColor = getFontColor(color);
    let priority;
    priorityInputs.forEach(item => {
        if (item.checked) {
            priority = item.value;
        }
    })

    const taskDescription = {
        "id": taskID,
        "isDone": false,
        "title": title,
        "text": text,
        "priority": priority,
        "color": color,
        "time": time,
        "timeOfAdd": timeOfAdd,
        "fontColor": fontColor
    }

    localStorage.setItem(taskID, JSON.stringify(taskDescription));

    const taskHTML = createTaskHTML(taskDescription);

    todoList.insertAdjacentHTML('beforeend', taskHTML);

    form.reset();

    $("#exampleModal").modal("hide");

}

function getTasks() {

    const keys = Object.keys(localStorage);

    let todoHTML = "";
    let completedHTML = "";

    keys.forEach(key => {
        if (key.startsWith('_')) {

            const task = localStorage.getItem(key);

            const taskDescription = JSON.parse(task);

            if (taskDescription.isDone) {
                completedHTML += createTaskHTML(taskDescription);
            } else {
                todoHTML += createTaskHTML(taskDescription);
            }
        }
    });

    todoList.insertAdjacentHTML('beforeend', todoHTML);
    completedList.insertAdjacentHTML('beforeend', completedHTML);

    sortTasks(true);
}

function sortTasks(old) {

    const tasksToDo = Array.from(todoList.querySelectorAll('li'));
    const tasksComplete = Array.from(completedList.querySelectorAll('li'));

    let todoHTML = "";
    let completeHTML = "";

    if (old) {
        tasksToDo.sort((a, b) => a.dataset.timeOfAdd - b.dataset.timeOfAdd);
        tasksComplete.sort((a, b) => a.dataset.timeOfAdd - b.dataset.timeOfAdd);
    } else {
        tasksToDo.sort((a, b) => b.dataset.timeOfAdd - a.dataset.timeOfAdd);
        tasksComplete.sort((a, b) => b.dataset.timeOfAdd - a.dataset.timeOfAdd);
    }

    tasksToDo.forEach(item => {
        let description = JSON.parse(localStorage.getItem(item.dataset.id));
        todoHTML += createTaskHTML(description);
    });

    tasksComplete.forEach(item => {
        let description = JSON.parse(localStorage.getItem(item.dataset.id));;
        completeHTML += createTaskHTML(description);
    });

    todoList.innerHTML = "";
    completedList.innerHTML = "";

    todoList.insertAdjacentHTML('beforeend', todoHTML);
    completedList.insertAdjacentHTML('beforeend', completeHTML);
} 


function activateNightMode() {
    
    if (nightButton.textContent === "On") {
        nightButton.textContent = "Off";
        sessionStorage.setItem('night', 'true');
    } else {
        nightButton.textContent = "On";
        sessionStorage.setItem('night', 'false');
    }

    document.body.classList.toggle('night-body');
    document.querySelectorAll('ul').forEach(item => {
        item.classList.toggle('night-ul');
    });

    document.querySelector('.modal').classList.toggle('night-modal');
    document.querySelector('.navbar').classList.toggle('bg-light');
    document.querySelector('.navbar').classList.toggle('night-nav');
}

function getNightMode() {
    if (sessionStorage.getItem('night') == 'true') {
        activateNightMode();
    }
}

function showCounters() {

    taskCounter = todoList.getElementsByTagName('li').length
    completeCounter = completedList.getElementsByTagName('li').length;

    todoList.previousElementSibling.innerHTML += " (" + taskCounter + ")";
    completedList.previousElementSibling.innerHTML += " (" + completeCounter + ")";
}

function getDateOfAdd() {

    let date = new Date();

    let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
    let month = ((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    let minutes = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

    let time = date.getHours() + ":" + minutes + " " + day + "." + month + "." + date.getFullYear();

    return time;
}

function createTaskHTML(description) {

    const { id, isDone, title, text, priority, time, timeOfAdd, color, fontColor } = description;

    if (isDone) {
        let taskHTML = `<li class="list-group-item d-flex w-100 mb-2" data-is-done="${isDone}" data-id="${id}" data-time="${timeOfAdd}" style="background-color:${color}; color: ${fontColor}">
                            <div class="w-100 mr-2">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${title}</h5>
                                    <div>
                                        <small class="mr-2">${priority} priority</small>
                                        <small class="date">${time}</small>
                                    </div>

                                </div>
                                <p class="mb-1 w-100">${text}</p>
                            </div>
                            <div class="dropdown m-2 dropleft">
                                <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
                                    <button type="button" class="btn btn-danger w-100">Delete</button>
                                </div>
                            </div>
                        </li>`
        
        return taskHTML;
        
    } else {
        let taskHTML = `<li class="list-group-item d-flex w-100 mb-2" data-is-done="${isDone}" data-id="${id}" data-time="${timeOfAdd}" style="background-color:${color}; color: ${fontColor}">
                            <div class="w-100 mr-2">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${title}</h5>
                                    <div>
                                        <small class="mr-2">${priority} priority</small>
                                        <small class="date">${time}</small>
                                    </div>

                                </div>
                                <p class="mb-1 w-100">${text}</p>
                            </div>
                            <div class="dropdown m-2 dropleft">
                                <button class="btn btn-secondary h-100" type="button" id="dropdownMenuItem1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu p-2 flex-column" aria-labelledby="dropdownMenuItem1">
                                    <button type="button" class="btn btn-success w-100">Complete</button>
                                    <button type="button" class="btn btn-info w-100 my-2">Edit</button>
                                    <button type="button" class="btn btn-danger w-100">Delete</button>
                                </div>
                            </div>
                        </li>`
        
        return taskHTML;
    }
}

function fillEditForm(description) {

    const { title, text, priority, color } = description;

    inputTitle.value = title;
    inputText.value = text;

    priorityInputs.forEach(item => {
        if (item.value === priority) {
            item.checked = true;
        }
    });

    inputColor.value = color;
}

 function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

function getFontColor(color) {

    if (parseInt(color.slice(1), 16) < 8e6) {
        return "#ffffff";
    } else {
        return "#000000";
    }
}
