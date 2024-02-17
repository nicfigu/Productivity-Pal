// all tasks
let tasks = [];


// show all tasks
const showTasks = () => {

    chrome.storage.sync.get(['todos']).then(data => {
        let html = '';
        if (data.todos != undefined && data.todos.length > 0) {
            data.todos.forEach((todo, index) => {
                html += `<li class="list-group-item d-flex align-items-center">`;
                html += `<input type="checkbox" class="form-check-input me-2" data-task-id="${index}" ${todo.completed ? 'checked' : ''}>`
                html += `<span class="${todo.completed ? 'text-decoration-line-through' : ''}">${todo.title}</span>`;
                html += `<div class="ms-auto">`
                html += `<button class="btn btn-sm text-primary me-1" data-task-edit=${index}>&#9998;</button>`
                html += `<button class="btn btn-sm text-danger fw-bold" data-task-remove=${index}>&#10005;</button>`
                html += `</div>`;
                html += `</li>`;
            });

        } else {
            html = `<li class="list-group-item text-secondary text-center">No Tasks</li>`;
        }
        document.querySelector('ul#tasks').innerHTML = html;
    });
}


// show stored tasks
showTasks();


// add new tasks
document.getElementById('add-task').addEventListener('submit', (e) => {
    e.preventDefault();
    let task = document.querySelector('input#task').value;
    document.querySelector('input#task').value = '';
    tasks.push({ completed: false, title: task });
    chrome.storage.sync.set({ todos: tasks }).then(showTasks);

});


document.querySelector('ul#tasks').addEventListener('click', async (e) => {
    // complete task
    if (e.target.getAttribute('data-task-id')) {
        let index = e.target.getAttribute('data-task-id');
        let data = await chrome.storage.sync.get(['todos']);
        tasks = data.todos;
        let task = tasks[index];
        e.target.checked
            ? tasks[index] = { completed: true, title: task.title }
            : tasks[index] = { completed: false, title: task.title };

        chrome.storage.sync.set({ todos: tasks }).then(showTasks);


    }


    // remove task
    if (e.target.getAttribute('data-task-remove')) {

        let index = e.target.getAttribute('data-task-remove');

        let data = await chrome.storage.sync.get(['todos']);
        tasks = data.todos;
        tasks.splice(index, 1);

        chrome.storage.sync.set({ todos: tasks }).then(showTasks);

    }


    // edit task
    if (e.target.getAttribute('data-task-edit')) {

        let index = e.target.getAttribute('data-task-edit');

        let data = await chrome.storage.sync.get(['todos']);
        tasks = data.todos;

        document.querySelector('input#task').value = tasks[index].title;
        tasks.splice(index, 1);

    }


});