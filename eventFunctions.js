import { createElementFromHTML, getDateOfAdd, createTaskHTML, setInputsToEmpty, generateId, getFontColor} from "./additionalFunctions";

export function completeTask(event) {

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

export function editTask(event) {
    if (event.target.classList.contains('btn-info')) {

        $("#exampleModal").modal("show");

        taskToEdit = event.target.closest('li');

        submitButton.textContent = "Edit";
    }
}

export function deleteTask(event) {

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

export function submitFormEdit(event) {

    event.preventDefault();

    if (submitButton.textContent === "Edit") {
        
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

export function submitFormAdd(event) {

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

}

export function getTasks() {

    let keys = Object.keys(localStorage);
    keys.reverse();

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

export function sortNew(event) {
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

export function sortOld(event) {

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

export function activateNightMode(event) {
    
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

export function getNightMode() {
    if (sessionStorage.getItem('night') == 'true') {
        activateNightMode();
    }
}

export function showCounters() {

    taskCounter = todoList.getElementsByTagName('li').length
    completeCounter = completedList.getElementsByTagName('li').length;

    todoList.previousElementSibling.innerHTML += " (" + taskCounter + ")";
    completedList.previousElementSibling.innerHTML += " (" + completeCounter + ")";
}