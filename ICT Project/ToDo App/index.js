document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todo-input');
  const todoList = document.getElementById('myList');
  const add = document.getElementById('button');

  // Load Todos from localStorage on page load
  const loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addtodo(todo.text)); // Add todo from localStorage to the list
  };

  // Save Todos to localStorage
  const saveTodos = () => {
    const todos = [];
    document.querySelectorAll('.todoItem').forEach(todoItem => {
      const todoText = todoItem.querySelector('span').textContent;
      todos.push({ text: todoText });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const deleteTodo = (todoItem) => {
    if (todoItem) {
      todoList.removeChild(todoItem);
      saveTodos(); // Update localStorage after deletion
    }
  };

  const updateTodo = (todoItem) => {
    const newTodoText = prompt('Edit List item:', todoItem.querySelector('span').textContent);
    if (newTodoText !== null) {
      todoItem.querySelector('span').textContent = newTodoText;
      saveTodos(); // Update localStorage after editing
    }
  };

  const addtodo = (todoText) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todoItem');
    todoItem.innerHTML = `
        <span class="todo-text">${todoText}</span>
        <button title="delete" class="delete-btn">DEL</button>
        <button title="edit" class="edit-btn">EDIT</button>
    `;

    todoList.appendChild(todoItem);

    // Add event listeners for delete and edit buttons
    todoItem.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTodo(todoItem);
    });

    let hoveredItem = null;

    // Detect when the mouse enters the element
    todoItem.querySelector('.todo-text').addEventListener('mouseenter', function () {
      hoveredItem = todoItem; // Store the currently hovered item
    });

    // Detect when the mouse leaves the element
    todoItem.querySelector('.todo-text').addEventListener('mouseleave', function () {
      hoveredItem = null; // Reset the hovered item when the mouse leaves
    });

    // Listen for the Delete key press globally
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Delete' && hoveredItem) {
        deleteTodo(hoveredItem); // Delete the hovered item if the Delete key is pressed
      }
    });
    // liten for the enter key to edit 
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && hoveredItem) {
        updateTodo(hoveredItem); // Delete the hovered item if the Delete key is pressed
      }
    });

    todoItem.querySelector('.edit-btn').addEventListener('click', () => {
      updateTodo(todoItem);
    });

    if (window, innerWidth < 769) {
      todoItem.querySelector('.todo-text').addEventListener('click', () => {
        updateTodo(todoItem);
      });
      todoItem.querySelector('.todo-text').setAttribute('title', 'click to edit')
    }

    // Update button text based on screen size for the current item
    updateButtonText(todoItem.querySelector('.edit-btn'));
    updateButtonText(todoItem.querySelector('.delete-btn'));

    saveTodos(); // Save to localStorage whenever a new todo is added
  };

  // Function to handle button text updates for screen resize
  const updateButtonText = (button) => {
    if (window.innerWidth < 1199 && window.innerWidth) {
      if (button.classList.contains('edit-btn')) {
        button.innerText = '+';
      } else if (button.classList.contains('delete-btn')) {
        button.innerText = 'x';
      }
    } else {
      if (button.classList.contains('edit-btn')) {
        button.innerText = 'EDIT';
      } else if (button.classList.contains('delete-btn')) {
        button.innerText = 'DEL';
      }
    }
  };

  // Resize the "Add" button text based on screen size
  const updateAddButtonText = () => {
    if (window.innerWidth < 768) {
      add.innerHTML = '+';

    } else {
      add.innerHTML = 'Add';
    }
  };

  // Initial screen size check
  updateAddButtonText();

  // Add a resize event listener to update all buttons when the screen resizes
  window.addEventListener('resize', () => {
    updateAddButtonText();

    // Update all existing todo items' buttons
    const todoItems = document.querySelectorAll('.todoItem');
    todoItems.forEach((todoItem) => {
      updateButtonText(todoItem.querySelector('.edit-btn'));
      updateButtonText(todoItem.querySelector('.delete-btn'));
    });
  });

  // Handle adding new todos
  add.addEventListener('click', () => {
    if (input.value.trim() !== '') {s 
      addtodo(input.value.trim());
      input.value = '';
    }
  });

  // Handle pressing "Enter" to add todos
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.trim() !== '') {
      addtodo(input.value.trim());
      input.value = '';
    }
  });

  // Load todos from localStorage when the page loads
  loadTodos();
});
