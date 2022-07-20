import { getTasks, showCounters, getNightMode, completeTask, editTask, deleteTask, submitFormAdd, submitFormEdit, sortNew, sortOld, activateNightMode } from "./eventFunctions";


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




