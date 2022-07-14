let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');
let taskClone = document.querySelector('.list-group-item').cloneNode(true);

let completeButtons = Array.from(document.getElementsByClassName('btn-success'));
let editButtons = Array.from(document.getElementsByClassName('btn-info'));
let deleteButtons = Array.from(document.getElementsByClassName('btn-danger'));

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');


todoList.addEventListener('click', completeTask); 

completedList.addEventListener('click', deleteTask); 
todoList.addEventListener('click', deleteTask);

form.addEventListener('submit', addTask);

function completeTask(event) {

    if (event.target.classList.contains('btn-success')) {
        let task = event.target.closest('li');
        let dropDown = event.target.closest(".dropdown");

        dropDown.querySelector('.btn-success').style.display = 'none';
        dropDown.querySelector('.btn-info').style.display = 'none';

        completedList.append(task);
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

    inputTitle.value = '';
    inputText.value = '';

    todoList.insertAdjacentElement("beforeend", task);

    $("#exampleModal").modal("hide");

}
