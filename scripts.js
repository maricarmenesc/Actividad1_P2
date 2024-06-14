document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('task-form').addEventListener('submit', addTask);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function addTask(e) {
    e.preventDefault();
    
    const name = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const responsible = document.getElementById('responsible').value;

    const task = {
        name,
        startDate,
        endDate,
        responsible,
        completed: false
    };

    addTaskToDOM(task);
    saveTask(task);
    
    e.target.reset();
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.classList.add('list-group-item');
    
    const today = new Date().toISOString().split('T')[0];
    
    if (task.completed) {
        taskItem.classList.add('completed');
    } else if (task.endDate < today) {
        taskItem.classList.add('expired');
    } else {
        taskItem.classList.add('pending');
    }
    
    taskItem.innerHTML = `
        <span>${task.name} - ${task.responsible} - ${task.startDate} a ${task.endDate}</span>
        <div>
            <button class="btn ${task.completed ? 'btn-uncomplete' : 'btn-complete'} btn-sm">${task.completed ? 'Desmarcar' : 'Completar'}</button>
            <button class="btn btn-delete btn-sm">Eliminar</button>
        </div>
    `;
    
    taskList.appendChild(taskItem);
    
    taskItem.querySelector('.btn-complete, .btn-uncomplete').addEventListener('click', () => {
        if (!task.completed && task.endDate < today) {
            alert('La tarea ya está vencida y no puede ser marcada como completada.');
            return;
        }
        
        task.completed = !task.completed;
        updateTask(task);
        taskItem.remove();
        addTaskToDOM(task);
    });

    taskItem.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
            deleteTask(task);
            taskItem.remove();
        }
    });
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(task => task.name === updatedTask.name && task.startDate === updatedTask.startDate);
    tasks[index] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(taskToDelete) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.name !== taskToDelete.name || task.startDate !== taskToDelete.startDate);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
