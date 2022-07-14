let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');
let taskClone = document.querySelector('.list-group-item').cloneNode(true);

let completeButtons = document.getElementsByClassName('btn-success');
let editButtons = document.getElementsByClassName('btn-info');
let deleteButtons = document.getElementsByClassName('btn-danger');

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');

for (item of completeButtons) {
    item.addEventListener('click', completeTask);
}

for (item of deleteButtons) {
    item.addEventListener('click', deleteTask);
}

form.addEventListener('submit', addTask);

function completeTask(event) {
    let task = event.target.closest('.list-group-item');
    let dropDown = event.target.closest(".dropdown");

    dropDown.querySelector('.btn-success').style.display = 'none';
    dropDown.querySelector('.btn-info').style.display = 'none';

    completedList.append(task);
}

function deleteTask(event) {
    let task = event.target.closest('.list-group-item');

    task.remove();
}

function addTask(event) {

    event.preventDefault();

    let task = taskClone;

    let title = task.querySelector('.mb-1');
    title.textContent = inputTitle.value;
    
    let text = task.querySelector('p');
    text.textContent = inputText.value;

    inputTitle.value = '';
    inputText.value = '';

    todoList.append(task);

    $("#exampleModal").modal("hide");

}
