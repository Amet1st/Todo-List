let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');
let taskClone = document.querySelector('.list-group-item').cloneNode(true);

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');


todoList.addEventListener('click', completeTask);

todoList.addEventListener('click', editTask);

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

    inputTitle.value = '';
    inputText.value = '';
    
    for (item of priorityInputs) {
        item.checked = false;
    }

    todoList.insertAdjacentElement("beforeend", task);

    $("#exampleModal").modal("hide");

}
