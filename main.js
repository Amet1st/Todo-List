let todoList = document.getElementById('currentTasks');
let completedList = document.getElementById('completedTasks');
let form = document.querySelector('form');

let taskToEdit;

let taskCounter = todoList.getElementsByClassName('list-group-item').length;
let completeCounter = completedList.getElementsByClassName('list-group-item').length;

todoList.previousElementSibling.innerHTML += " (" + taskCounter + ")";
completedList.previousElementSibling.innerHTML += " (" + completeCounter + ")";

let inputTitle = document.getElementById('inputTitle');
let inputText = document.getElementById('inputText');
let priorityInputs = document.querySelectorAll('input[type="radio"]');
let inputColor = document.getElementById('inputColor');
let button = document.getElementById('add');

let sortNewButton = document.getElementById('sortNew');
let sotrOldButton = document.getElementById('sortOld');
let nightButton = document.getElementById('night');

/*$('#exampleModal').on('hide.bs.modal', function (e) {
    alert(1);
});*/


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
        let dropDown = event.target.closest(".dropdown");

        dropDown.querySelector('.btn-success').style.display = 'none';
        dropDown.querySelector('.btn-info').style.display = 'none';

        todoList.previousElementSibling.innerHTML = "ToDo (" + --taskCounter + ")";
        completedList.previousElementSibling.innerHTML = "Completed (" + ++completeCounter + ")";

        completedList.append(task);
    }
}

function editTask(event) {
    if (event.target.classList.contains('btn-info')) {
        $("#exampleModal").modal("show");

        taskToEdit = event.target.closest('li');

        button.textContent = "Edit";

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
        

        task.remove();
    }
}

function submitFormEdit(event) {

    event.preventDefault();

    if (button.textContent === "Edit") {
        
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

        let date = new Date();

        //Components of date calculation

        let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
        let month = ((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        let minutes = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

        let time = date.getHours() + ":" + minutes + " " + day + "." + month + "." + date.getFullYear();

        let timeOfAdd = date.getTime();
        task.timeOfAdd = timeOfAdd;

        let dateElement = task.querySelector('.date');
        dateElement.textContent = time;

        task.style.backgroundColor = inputColor.value;

        
        //"Darkness" of the color calculation
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


        $("#exampleModal").modal("hide");

    }

   
}

function submitFormAdd(event) {

    event.preventDefault();

    if (button.textContent == "Add task") {

        todoList.previousElementSibling.innerHTML = "ToDo (" + ++taskCounter + ")";
        let title = inputTitle.value;
        let text = inputText.value;

        let priority;

        for (item of priorityInputs) {
            if (item.checked) {
                priority = item.value;
            }
        }

        let date = new Date();

        //Components of date calculation

        let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
        let month = ((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        let minutes = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

        let time = date.getHours() + ":" + minutes + " " + day + "." + month + "." + date.getFullYear();

        let taskHTML = `<div class="w-100 mr-2">
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
                    </div>`

        task = document.createElement('li');
        task.className = "list-group-item d-flex w-100 mb-2";
        task.innerHTML = taskHTML;

        let timeOfAdd = date.getTime();
        task.timeOfAdd = timeOfAdd;


        task.style.backgroundColor = inputColor.value;

        
        //"Darkness" of the color calculation
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

        todoList.append(task);
        

        $("#exampleModal").modal("hide");
    }

    button.textContent = "Add task";

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

function activateNightMode(event) {
    
    if (nightButton.textContent == "On") {
        nightButton.textContent = "Off";
    } else {
        nightButton.textContent = "On";
    }

    document.body.classList.toggle('night-body');
    document.querySelectorAll('ul').forEach(item => {
        item.classList.toggle('night-ul');
    });
    document.querySelector('.modal').classList.toggle('night-modal');
    document.querySelector('.navbar').classList.toggle('bg-light');
    document.querySelector('.navbar').classList.toggle('night-nav');
}



