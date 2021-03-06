let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');

let taskToEdit;
let taskCounter;
let completeCounter;

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');
let inputColor = document.getElementById('inputColor');

let submitButton = document.getElementById('add');
let sortNewButton = document.getElementById('sortNew');
let sotrOldButton = document.getElementById('sortOld');
let nightButton = document.getElementById('night');
let editLabel = document.getElementById('exampleModalLabel');

document.addEventListener('DOMContentLoaded', getTasks);
document.addEventListener('DOMContentLoaded', showCounters);
document.addEventListener('DOMContentLoaded', getNightMode);

todoList.addEventListener('click', completeTask);
todoList.addEventListener('click', editTask);
todoList.addEventListener('click', deleteTask);

completedList.addEventListener('click', deleteTask); 

form.addEventListener('submit', submitFormEdit);
form.addEventListener('submit', submitFormAdd);

sortNewButton.addEventListener('click', sortNew);
sotrOldButton.addEventListener('click', sortOld);
nightButton.addEventListener('click', activateNightMode);

function completeTask(event) {

    if (event.target.classList.contains('btn-success')) {

        let task = event.target.closest('li');

        task.querySelector('.btn-success').style.display = 'none';
        task.querySelector('.btn-info').style.display = 'none';

        todoList.previousElementSibling.innerHTML = "ToDo (" + --taskCounter + ")";
        completedList.previousElementSibling.innerHTML = "Completed (" + ++completeCounter + ")";

        let taskDescription = JSON.parse(localStorage.getItem(task.dataset.id));

        taskDescription.isDone = true;

        localStorage.setItem(taskDescription.id, JSON.stringify(taskDescription));

        completedList.append(task);
    }
}

function editTask(event) {
    if (event.target.classList.contains('btn-info')) {

        $("#exampleModal").modal("show");

        taskToEdit = event.target.closest('li');

        let title = taskToEdit.querySelector('.mb-1').textContent;
        let text = taskToEdit.querySelector('p').textContent;
        let priorityItem = taskToEdit.querySelector('small').textContent;
        let priority = getPriority(priorityItem);

        let color = rgb2hex(taskToEdit.style.backgroundColor);

        fillEditForm(title, text, priority, color);

        submitButton.textContent = "Edit task";

        editLabel.textContent = "Edit task";
        
    }
}

function deleteTask(event) {

    if (event.target.classList.contains('btn-danger')) {

        let task = event.target.closest('li');

        if (event.target.closest('#currentTasks')) {
            todoList.previousElementSibling.innerHTML = "ToDo (" + --taskCounter + ")";
        } else {
            completedList.previousElementSibling.innerHTML = "Completed (" + --completeCounter + ")";
        }
        
        localStorage.removeItem(task.dataset.id);

        task.remove();
    }
}

function submitFormEdit(event) {

    event.preventDefault();

    if (submitButton.textContent === "Edit task") {
        
        let task = taskToEdit;

        let title = task.querySelector('.mb-1');
        title.textContent = inputTitle.value;
    
        let text = task.querySelector('p');
        text.textContent = inputText.value;

        let priority = task.querySelector('small');
        for (item of priorityInputs) {
            if (item.checked) {
                priority.textContent = item.value + " priority";
            }
        }

        let time = getDateOfAdd();
        let timeOfAdd = (new Date()).getTime();
        task.timeOfAdd = timeOfAdd;

        let dateElement = task.querySelector('.date');
        dateElement.textContent = time;

        let color = inputColor.value;
        task.style.backgroundColor = color;
        let fontColor = getFontColor(inputColor.value);
        task.style.color = fontColor;

        taskDescription = {
            "id": task.dataset.id,
            "title": title.textContent,
            "text": text.textContent,
            "priority": priority.textContent,
            "color": color,
            "time": time,
            "timeOfAdd": timeOfAdd,
            "fontColor": fontColor
        }

        localStorage.setItem(task.dataset.id, JSON.stringify(taskDescription));

        setInputsToEmpty();

        $("#exampleModal").modal("hide");

    }
}

function submitFormAdd(event) {

    event.preventDefault();

    if (submitButton.textContent == "Add task") {

        todoList.previousElementSibling.innerHTML = "ToDo (" + ++taskCounter + ")";

        let title = inputTitle.value;
        let text = inputText.value;
        let priority;

        for (item of priorityInputs) {
            if (item.checked) {
                priority = item.value;
            }
        }
        
        let time = getDateOfAdd();
        let timeOfAdd = (new Date()).getTime();

        let taskID = generateId();

        let color = inputColor.value;
        let fontColor = getFontColor(color);

        let taskHTML = createTaskHTML(taskID, title, text, priority, time, timeOfAdd, color, fontColor);

        setInputsToEmpty();

        todoList.insertAdjacentHTML('beforeend', taskHTML);

        taskDescription = {
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

        $("#exampleModal").modal("hide");
    }

    submitButton.textContent = "Add task";

    editLabel.textContent = "Add task";

}

function getTasks() {

    let keys = Object.keys(localStorage);

    for (let key of keys) {

        if (key.startsWith('_')) {
            
            let taskDescription = JSON.parse(localStorage[key]);

            let taskID = taskDescription.id;
            let title = taskDescription.title;
            let text = taskDescription.text;
            let priority = taskDescription.priority;
            let color = taskDescription.color;
            let time = taskDescription.time;
            let timeOfAdd = taskDescription.timeOfAdd;
            let fontColor = taskDescription.fontColor;

            let taskHTML = createTaskHTML(taskID, title, text, priority, time, timeOfAdd, color, fontColor);
            let task = createElementFromHTML(taskHTML);

            task.querySelector('.dropdown').classList.remove('show');
            task.querySelector('.dropdown-menu').classList.remove('show');

            if (taskDescription.isDone) {
                task.querySelector('.btn-success').style.display = 'none';
                task.querySelector('.btn-info').style.display = 'none';

                completedList.append(task);
            } else {
                todoList.append(task);
            }
        }
        
    }
}

function createElementFromHTML(html) {

    let div = document.createElement('div');
    
    div.innerHTML = html.trim();
 
    return div.firstChild;
}

function sortNew(event) {
    let tasksToDo = Array.from(todoList.querySelectorAll('li'));
    let tasksComplete = Array.from(completedList.querySelectorAll('li'));

    tasksToDo.sort((a, b) => b.dataset.time - a.dataset.time);
    tasksComplete.sort((a, b) => b.dataset.time - a.dataset.time);

    for (let task of tasksToDo) {
        todoList.append(task);
    }

    for (let task of tasksComplete) {
        completedList.append(task);
    }
}

function sortOld(event) {

    let tasksToDo = Array.from(todoList.querySelectorAll('li'));
    let tasksComplete = Array.from(completedList.querySelectorAll('li'));

    tasksToDo.sort((a, b) => a.dataset.time - b.dataset.time);
    tasksComplete.sort((a, b) => a.dataset.time - b.dataset.time);

    for (let task of tasksToDo) {
        todoList.append(task);
    }

    for (let task of tasksComplete) {
        completedList.append(task);
    }
}

function activateNightMode(event) {
    
    if (nightButton.textContent == "On") {
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

function createTaskHTML(taskID, title, text, priority, time, timeOfAdd, color, fontColor) {

    let taskHTML = `<li class="list-group-item d-flex w-100 mb-2" data-id ="${taskID}" data-time="${timeOfAdd}" style="background-color:${color}; color: ${fontColor}">
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

function fillEditForm(title, text, priority, color) {

    inputTitle.value = title;
    inputText.value = text;

    for (item of priorityInputs) {

        if (item.value == priority) {
            
            item.checked = true;
        }
    }

    inputColor.value = color;
}

function setInputsToEmpty() {

    inputTitle.value = '';
    inputText.value = '';
    inputColor.value = "#ffffff";
    
    for (item of priorityInputs) {
        item.checked = false;
    }
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

function getPriority(string) {
    let priority = "";

    for (let char of string) {
        if (char == " ") {
            break
        } else {
            priority += char;
        }
    }

    return priority;
}

function rgb2hex(rgb) {
    var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};