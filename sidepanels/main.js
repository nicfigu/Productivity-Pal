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
    html+= '<button>'
    document.querySelector('ul#tasks').innerHTML = html;
};

document.addEventListener('DOMContentLoaded', function() {
    // This function is executed when the DOM content is fully loaded

    // Find the button element by its ID
    const button = document.getElementById('downloadButton');

    // Add an event listener for the button click
    button.addEventListener('click', exportTasks());
});
function exportTasks() {
    // Convert the array elements to a formatted string
    const formattedList = tasks.map(item => `- ${item}`).join('\n\n');
    const currentDate = new Date();

    // Extract date components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Concatenate with the provided string
    const joinedString = `${'ProdPal'}_${month}/${day}/${year}.txt`;
    
    // Write the formatted list to the file
    const blob = new Blob([formattedList], { type: 'text/plain' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.download = joinedString;

    // Create a URL for the Blob and trigger the download
    link.href = window.URL.createObjectURL(blob);
    link.click();

    // Clean up by revoking the URL object
    window.URL.revokeObjectURL(link.href);
}
