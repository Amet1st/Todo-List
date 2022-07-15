let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');
let firstTask = document.querySelector('.list-group-item');
let taskClone = firstTask.cloneNode(true);

firstTask.timeOfAdd = 0;
let taskToEdit;

let taskCounter = todoList.getElementsByClassName('list-group-item').length;
let completeCounter = completedList.getElementsByClassName('list-group-item').length;



let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');
let inputColor = document.getElementById('inputColor');
let button = document.getElementById('add');

let sortNewButton = document.getElementById('sortNew');
let sotrOldButton = document.getElementById('sortOld');

todoList.addEventListener('click', completeTask);

todoList.addEventListener('click', editTask);

completedList.addEventListener('click', deleteTask); 
todoList.addEventListener('click', deleteTask);

form.addEventListener('submit', formSubmit);

sortNewButton.addEventListener('click', sortNew);
sotrOldButton.addEventListener('click', sortOld);

function completeTask(event) {

    if (event.target.classList.contains('btn-success')) {
        let task = event.target.closest('li');
        let dropDown = event.target.closest(".dropdown");

        dropDown.querySelector('.btn-success').style.display = 'none';
        dropDown.querySelector('.btn-info').style.display = 'none';

        completedList.append(task);
    }
}

function editTask(event) {
    if (event.target.classList.contains('btn-info')) {
        $("#exampleModal").modal("show");

        taskToEdit = event.target.closest('li');

        console.log(taskToEdit);

        button.textContent = "Edit";
    }
}

function deleteTask(event) {

    if (event.target.classList.contains('btn-danger')) {
        let task = event.target.closest('li');

        task.remove();
    }
}

function formSubmit(event) {

    event.preventDefault();

    let task = (button.textContent == "Add task") ? document.createElement('li') : taskToEdit;

    if (button.textContent == "Add task") {
        task.innerHTML = taskClone.innerHTML;
        task.classList = "list-group-item d-flex w-100 mb-2";
    }

    task.innerHTML = taskClone.innerHTML;
    task.classList = "list-group-item d-flex w-100 mb-2";

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

    let date = new Date();

    let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
    let month = ((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    let minutes = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

    let time = date.getHours() + ":" + minutes + " " + day + "." + month + "." + date.getFullYear();

    let timeOfAdd = date.getTime();
    task.timeOfAdd = timeOfAdd;

    let dateElement = task.querySelector('.date');
    dateElement.textContent = time;

    task.style.backgroundColor = inputColor.value;

    
    //Color "darkness" checking
    if (parseInt(inputColor.value.slice(1), 16) < 8e6) {
        task.style.color = "#ffffff";
    }

    //Set inputs to default values

    inputTitle.value = '';
    inputText.value = '';
    inputColor.value = "#ffffff";
    
    for (item of priorityInputs) {
        item.checked = false;
    }

    if (button.textContent == "Add task") {
        todoList.insertAdjacentElement("beforeend", task);
    }
    
    if (button.textContent == "Edit") {
        button.textContent = "Add task";
    }

    $("#exampleModal").modal("hide");

}


function sortNew(event) {
    let tasks = Array.from(todoList.querySelectorAll('.list-group-item'));

    tasks.sort((a, b) => b.timeOfAdd - a.timeOfAdd);

    for (let task of tasks) {
        todoList.append(task);
    }
}

function sortOld(event) {
    let tasks = Array.from(todoList.querySelectorAll('.list-group-item'));

    tasks.sort((a, b) => a.timeOfAdd - b.timeOfAdd);

    for (let task of tasks) {
        todoList.append(task);
    }
}
