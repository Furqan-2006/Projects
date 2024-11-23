document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todo-input');
  const todoList = document.getElementById('myList');
  const add = document.getElementById('Add-button');

  // Load Todos from localStorage on page load
  const loadTodos = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodo(todo.text)); // Add todo from localStorage to the list
  };

  // Save Todos to localStorage
  const saveTodos = () => {
    const todos = [];
    document.querySelectorAll('.todoItem').forEach(todoItem => {
      const todoText = todoItem.querySelector('textarea').value; // Use .value for textarea
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

  const copyTodo = (todoItem) => {
    const textarea = todoItem.querySelector('textarea');
    textarea.select();
    navigator.clipboard.writeText(textarea.value)
      .then(() => alert("Copied to clipboard"))
      .catch(err => console.error("Failed to copy: ", err));
  };


  // Function to auto-resize the textarea
  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
  };

  const addTodo = (todoText) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todoItem');
    todoItem.innerHTML = `
        <textarea class="todo-text">${todoText}</textarea>
        <button title="delete" class="delete-btn">DEL</button>
        <button title="copy" class="copy-btn">EDIT</button>
    `;

    todoList.appendChild(todoItem);

    const textarea = todoItem.querySelector('textarea');
    autoResizeTextarea(textarea); // Auto-resize when the item is added
    textarea.addEventListener('input', () => autoResizeTextarea(textarea)); // Auto-resize on input

    // Add event listeners for delete and edit buttons
    todoItem.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTodo(todoItem);
    });

    let hoveredItem = null;

    // Detect mouse hover on todo text area
    textarea.addEventListener('mouseenter', () => {
      hoveredItem = todoItem; // Store the currently hovered item
    });

    textarea.addEventListener('mouseleave', () => {
      hoveredItem = null; // Reset the hovered item when the mouse leaves
    });

    // Reusable function for handling keydown events
    const handleKeydown = (event, key, action) => {
      if (event.key === key && hoveredItem) {
        action(hoveredItem); // Perform action if the key is pressed on a hovered item
      }
    };

    // Listen for Delete and Enter keys globally
    document.addEventListener('keydown', (event) => {
      handleKeydown(event, 'Delete', deleteTodo);
    });

    todoItem.querySelector('.copy-btn').addEventListener('click', () => {
      copyTodo(todoItem);
    });

    if (window.innerWidth < 769) {
      textarea.addEventListener('click', () => {
        copyTodo(todoItem);
      });
      textarea.setAttribute('title', 'click to copy');
    }

    // Update button text based on screen size for the current item
    updateButtonText(todoItem.querySelector('.copy-btn'));
    updateButtonText(todoItem.querySelector('.delete-btn'));

    saveTodos(); // Save to localStorage whenever a new todo is added
  };

  // Function to handle button text updates for screen resize
  const updateButtonText = (button) => {
    if (window.innerWidth < 1199) {
      button.innerHTML = button.classList.contains('copy-btn') ? '<i class="bi bi-copy"></i>' : '<i class="bi bi-trash"></i>';
    } else {
      button.innerHTML = button.classList.contains('copy-btn') ? '<i class="bi bi-copy"></i>' : '<i class="bi bi-trash"></i>';
    }
  };

  // Resize the "Add" button text based on screen size
  const updateAddButtonText = () => {
    add.innerHTML = window.innerWidth < 768 ? '<i class="bi bi-plus-square-fill"></i>' : '<i class="bi bi-plus-square-fill"></i>';
  };

  // Initial screen size check
  updateAddButtonText();

  // Add a resize event listener to update all buttons when the screen resizes
  window.addEventListener('resize', () => {
    updateAddButtonText();

    // Update all existing todo items' buttons
    const todoItems = document.querySelectorAll('.todoItem');
    todoItems.forEach((todoItem) => {
      updateButtonText(todoItem.querySelector('.copy-btn'));
      updateButtonText(todoItem.querySelector('.delete-btn'));
    });
  });

  // Handle adding new todos
  add.addEventListener('click', () => {
    if (input.value.trim() !== '') {
      addTodo(input.value.trim());
      input.value = '';
    }
  });

  // Handle pressing "Enter" to add todos
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.trim() !== '') {
      addTodo(input.value.trim());
      input.value = '';
    }
  });

  // Load todos from localStorage when the page loads
  loadTodos();
});
