let tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tasks array by retrieving it from chrome.storage.sync
    chrome.storage.sync.get(['tasks'], (data) => {
        tasks = data.tasks || [];
        showTasks();
    });
});

// add new tasks
document.getElementById('add-task').addEventListener('submit', (e) => {
    e.preventDefault();
    let task = document.querySelector('input#task').value.trim();
    if (task !== '') {
        document.querySelector('input#task').value = '';
        tasks.push({ completed: false, title: task });

        // Update tasks array in chrome.storage.sync
        chrome.storage.sync.set({ tasks: tasks }, () => {
            showTasks();
        });
    }
});

// Complete, remove, or edit tasks
document.querySelector('ul#tasks').addEventListener('click', async (e) => {
    const index = e.target.dataset.taskId;
    if (index !== undefined) {
        tasks[index].completed = !tasks[index].completed;

        // Toggle sparkle class on the task item
        const taskItem = document.getElementById(`task-item-${index}`);
        // Update tasks array in chrome.storage.sync
        chrome.storage.sync.set({ tasks: tasks }, () => {
            showTasks();
        });
    }

    const removeIndex = e.target.dataset.taskRemove;
    if (removeIndex !== undefined) {
        tasks.splice(removeIndex, 1);

        // Update tasks array in chrome.storage.sync
        chrome.storage.sync.set({ tasks: tasks }, () => {
            showTasks();
        });
    }

    const editIndex = e.target.dataset.taskEdit;
    if (editIndex !== undefined) {
        document.querySelector('input#task').value = tasks[editIndex].title;
        tasks.splice(editIndex, 1);

        // Update tasks array in chrome.storage.sync
        chrome.storage.sync.set({ tasks: tasks }, () => {
            showTasks();
        });
    }
});

// Function to show tasks
const showTasks = () => {
    let html = '';
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            html += `<li class="list-group-item d-flex align-items-center" id="task-item-${index}">
                <input type="checkbox" class="form-check-input me-2" data-task-id="${index}" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'text-decoration-line-through sparkle' : ''}">${task.title}</span>
                <div class="ms-auto">
                    <button class="btn btn-sm text-primary me-1" data-task-edit="${index}">&#9998;</button>
                    <button class="btn btn-sm text-danger fw-bold" data-task-remove="${index}">&#10005;</button>
                </div>
            </li>`;
        });
    } else {
        html = `<li class="list-group-item text-secondary text-center">No Tasks</li>`;
    }
    document.querySelector('ul#tasks').innerHTML = html;
};
