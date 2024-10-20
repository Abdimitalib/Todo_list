const API_KEY = "S423nhP5tH2gM1fw1OmLlwG50FT3KjlABNaDE74Deb0"
const BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/merc?format=json"   
const API_URL = 'http://localhost:3000/tasks'; 
let todos = [];


// Load todos from json-server and localStorage when the page loads
window.onload = async function() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    } else {
        await fetchTodosFromServer(); // Fetch from json-server if localStorage is empty
    }
    renderTodos();
};

// Fetch todos from json-server
async function fetchTodosFromServer() {
    try {
        const response = await fetch(API_URL);
        todos = await response.json();
        saveTodos(); // Save fetched todos to localStorage
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new todo to both json-server and localStorage
async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text) {
        const newTodo = { id: Date.now(), text, completed: false };
        todos.push(newTodo);
        input.value = '';

        saveTodos();
        renderTodos();

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
}

// Edit the text of a todo
async function editTodoText(id, newText) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText;
        saveTodos();
        renderTodos();

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });
        } catch (error) {
            console.error('Error editing todo:', error);
        }
    }
}

// Toggle todo completion
async function toggleTodoCompletion(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: todo.completed })
            });
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }
}

// Delete a todo
async function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();

    try {
        await fetch($`{API_URL}/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Replace a todo completely using PUT
async function replaceTodo(id, newTodo) {
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
        todos[index] = { ...newTodo, id }; // Ensure the ID remains the same
        saveTodos();
        renderTodos();

        try {
            await fetch($`{API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
        } catch (error) {
            console.error('Error replacing todo:', error);
        }
    }
}



// Render todos in the UI
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        todoItem.innerHTML = `
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodoCompletion(${todo.id})">
            <input type="text" 
                   class="todo-text" 
                   value="${todo.text}" 
                   onblur="editTodoText(${todo.id}, this.value)">
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;

        todoList.appendChild(todoItem);
    });
}

// Add event listener for Enter key
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});