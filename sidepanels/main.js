let tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tasks array by retrieving it from chrome.storage.sync
    chrome.storage.sync.get(['tasks'], (data) => {
        tasks = data.tasks || [];
        showTasks();
        updateProgressBar();
        setInterval(showTasks, 10000);
        // Call updateProgressBar periodically to keep the progress bars updated
        setInterval(updateProgressBar, 1000); // Update every 1 seconds
        
    });
});

// add new tasks
document.getElementById('add-task').addEventListener('submit', (e) => {
    e.preventDefault();
    let task = document.querySelector('input#task').value.trim();
    if (task !== '') {
        var timeMatch = task.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
        var taskName = task;
        var taskTime = null;
        if (timeMatch){
            taskTime = getTimeMilliseconds(timeMatch[0]);
        }
        document.querySelector('input#task').value = '';
        tasks.push({ completed: false, title: taskName,  time: taskTime, start: 0, progress: 0});

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
    //start button
    const startIndex = e.target.dataset.taskStart;
    if (startIndex !== undefined) {
        let index = parseInt(startIndex);
        let now = Date.now(); // Get the current timestamp
        if (tasks[index].start > 0) {
            tasks[index].start = 0; // If already started, set to null to pause
            e.target.textContent = 'Start'; // Change button text to "Start"
        } else if (tasks[index].start == 0){
            tasks[index].start = now; // If not started, set to current timestamp to start
            e.target.textContent = 'Pause'; // Change button text to "Pause"
            e.target.dataset.click = 1;
        }
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
function getTimeMilliseconds(timeString) {
    // Split the time string into hours, minutes, and AM/PM parts
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format if needed
    let hourValue = parseInt(hours, 10);
    if (period === 'PM' && hourValue < 12) {
        hourValue += 12;
    } else if (period === 'AM' && hourValue === 12) {
        hourValue = 0; // Midnight
    }

    // Create a new Date object with today's date and the parsed time
    const currentDate = new Date();
    const dateWithTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hourValue, parseInt(minutes, 10));

    // Get the number of milliseconds since the Unix Epoch until that time
    return dateWithTime.getTime();
};
function updateProgressBar() {
    tasks.forEach((task, index) => {
        const listItem = document.getElementById(`task-item-${index}`);
        if (task.start) {
            const currentTime = new Date();
            const deadlineTime = new Date(task.time);
            if (deadlineTime - currentTime > 0 && task.start){ 
                // Calculate the percentage of time elapsed
                const totalTime = deadlineTime - task.start;
                const timeElapsed = deadlineTime - currentTime;
                const percentageElapsed = 100 - (timeElapsed / totalTime) * 100;
                task.progress = percentageElapsed;
                if((timeElapsed <= 60*60*1000+1050) && (timeElapsed >= 60*60*1000-1050)){
                    //const sString = `Did you start this task? "${task}"\nYou have one hour!`;
                    sendSFNotif(60);
                }     
                if((timeElapsed <= 15*60*1000+1050) && (timeElapsed >= 15*60*1000-1050)){
                    //const fString = `Are you finishing this task? "${task}"\n15 minutes left!`;
                    sendSFNotif(15);
                }                   
            
                // Update the value attribute of the progress element
                const percentageWidth = percentageElapsed<=100 ?  `${percentageElapsed}%` :  '100%';
                // Apply linear gradient background
                task.completed == true ? listItem.style.backgroundImage = `linear-gradient(to right, green ${percentageWidth}, transparent ${percentageWidth})`: listItem.style.backgroundImage = `linear-gradient(to right, red ${percentageWidth}, transparent ${percentageWidth})`;
    }}});
};

function sendSFNotif(time){  
    if(time == 15)
    chrome.alarms.create('15', {
      when: Date.now(),
    });
    if(time == 60)
    chrome.alarms.create('60', {
        when: Date.now(),
      });
  };

// Function to show tasks
const showTasks = () => {
    let html = '';
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            // Determine the text for the button based on the value of data-task-click
            let buttonText = '';
            let currTimeinMilli = Date.now();
            if (!task.start) {
                buttonText = 'Start';
            } else {
                buttonText = 'Pause';
            }
            if(task.time !== null && task.time < currTimeinMilli) task.completed = 1;
            html += `<li class="list-group-item d-flex align-items-center ${task.time ? 'time-available' : ''}" id="task-item-${index}">
                <input type="checkbox" class="form-check-input me-2" data-task-id="${index}" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'text-decoration-line-through sparkle' : ''}">${task.title}</span>
                <div class="ms-auto">
                ${task.time !== null && task.time > currTimeinMilli ? `<button class="btn btn-sm text-success me-1" data-task-start="${index}">${buttonText}</button>` : ''}
                <button class="btn btn-sm text-primary me-1" data-task-edit="${index}">&#9998;</button> <!-- Edit button -->
                <button class="btn btn-sm text-danger fw-bold" data-task-remove="${index}">&#10005;</button> <!-- Remove button -->
                </div>
            </li>`;
        });
    } else {
        html = `<li class="list-group-item text-secondary text-center">No Tasks</li>`;
    }
    html+= '<button>'
    document.querySelector('ul#tasks').innerHTML = html;
};

