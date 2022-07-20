export function createElementFromHTML(html) {

    let div = document.createElement('div');
    
    div.innerHTML = html.trim();
 
    return div.firstChild;
}

export function getDateOfAdd() {

    let date = new Date();

    let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
    let month = ((date.getMonth() + 1) < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    let minutes = ((date.getMinutes()) < 10) ? ("0" + date.getMinutes()) : date.getMinutes();

    let time = date.getHours() + ":" + minutes + " " + day + "." + month + "." + date.getFullYear();

    return time;
}

export function createTaskHTML(taskID, title, text, priority, time, timeOfAdd, color, fontColor) {

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

export function setInputsToEmpty() {

    inputTitle.value = '';
    inputText.value = '';
    inputColor.value = "#ffffff";
    
    for (item of priorityInputs) {
        item.checked = false;
    }
}

export function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

export function getFontColor(color) {

    if (parseInt(color.slice(1), 16) < 8e6) {
        return "#ffffff";
    } else {
        return "#000000";
    }
}