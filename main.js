let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');
let firstTask = document.querySelector('.list-group-item');
let taskClone = firstTask.cloneNode(true);

firstTask.timeOfAdd = 0;

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');
let inputColor = document.getElementById('inputColor');

let sortNewButton = document.getElementById('sortNew');
let sotrOldButton = document.getElementById('sortOld');

todoList.addEventListener('click', completeTask);

todoList.addEventListener('click', editTask);

completedList.addEventListener('click', deleteTask); 
todoList.addEventListener('click', deleteTask);

form.addEventListener('submit', addTask);

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
        $('#myModal').modal('show');
    }
}

function deleteTask(event) {

    if (event.target.classList.contains('btn-danger')) {
        let task = event.target.closest('li');

        task.remove();
    }
}

function addTask(event) {

    event.preventDefault();

    let task = document.createElement('li');
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

    if (parseInt(inputColor.value.slice(1), 16) < 8e6) {
        task.style.color = "#ffffff";
    }

    inputTitle.value = '';
    inputText.value = '';
    inputColor.value = "#ffffff";
    
    for (item of priorityInputs) {
        item.checked = false;
    }

    todoList.insertAdjacentElement("beforeend", task);

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
