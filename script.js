let todos = [];

// Load todos from localStorage when the page loads
window.onload = function() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        renderTodos();
    }
};

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text) {
        todos.push({
            id: Date.now(),
            text: text,
            completed: false,
            isEditing: false // New flag to track editing state
        });
        
        input.value = '';
        saveTodos();
        renderTodos();
    }
}

// Add event listener for Enter key
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isEditing = true;  // Enable editing mode
        renderTodos();
    }
}

function updateTodo(id) {
    const todo = todos.find(t => t.id === id);
    const newText = document.getElementById(`editInput-${id}`).value.trim();
    
    if (todo && newText) {
        todo.text = newText;    // Update the text
        todo.isEditing = false; // Exit editing mode
        saveTodos();
        renderTodos();
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        if (todo.isEditing) {
            // Render input field and update button when editing
            todoItem.innerHTML = `
                <input id="editInput-${todo.id}" type="text" value="${todo.text}" class="edit-input">
                <button onclick="updateTodo(${todo.id})">Update</button>
                <button onclick="renderTodos()">Cancel</button>
            `;
        } else {
            // Render regular todo item with Edit and Delete buttons
            todoItem.innerHTML = `
                <input type="checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <button onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
        }

        todoList.appendChild(todoItem);
    });
}
