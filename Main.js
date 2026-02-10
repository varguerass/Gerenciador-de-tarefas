const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const taskDate = document.getElementById("task-date");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const clearCompletedButton = document.getElementById("clear-completed");
const summaryText = document.getElementById("summary-text");
const filterButtons = document.querySelectorAll(".filter");
const toggleThemeButton = document.getElementById("toggle-theme");
const hero = document.querySelector(".hero");

let tasks = [];
let activeFilter = "all";
let editingId = null;

const storageKey = "gerenciador_tarefas_v1";
const themeKey = "gerenciador_tarefas_theme";

function loadTasks() {
  const stored = localStorage.getItem(storageKey);
  tasks = stored ? JSON.parse(stored) : [];
  tasks = tasks.map((task) => ({
    createdAt: task.createdAt ?? 0,
    ...task,
  }));
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function loadTheme() {
  const storedTheme = localStorage.getItem(themeKey) || "light";
  applyTheme(storedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  toggleThemeButton.textContent = theme === "dark" ? "Modo claro" : "Modo noturno";
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
}

function formatDate(value) {
  if (!value) return "Sem prazo";
  const date = new Date(value + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate + "T00:00:00");
  return due < getTodayStart();
}

function createTaskElement(task) {
  const item = document.createElement("li");
  const overdue = isOverdue(task);
  item.className = `task ${task.completed ? "completed" : ""} ${overdue ? "overdue" : ""}`.trim();
  item.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const content = document.createElement("div");

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "meta";

  const priority = document.createElement("span");
  priority.className = `tag ${task.priority}`;
  priority.textContent = task.priority;

  const due = document.createElement("span");
  due.textContent = `Prazo: ${formatDate(task.dueDate)}`;

  meta.appendChild(priority);
  meta.appendChild(due);

  if (overdue) {
    const late = document.createElement("span");
    late.className = "tag atrasada";
    late.textContent = "Atrasada";
    meta.appendChild(late);
  }

  const isEditing = editingId === task.id;
  if (isEditing) {
    const editField = document.createElement("input");
    editField.type = "text";
    editField.value = task.title;
    editField.className = "edit-input";
    editField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveEdit(task.id, editField.value);
      if (event.key === "Escape") cancelEdit();
    });

    content.appendChild(editField);
    content.appendChild(meta);
    setTimeout(() => editField.focus(), 0);
  } else {
    content.appendChild(title);
    content.appendChild(meta);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (isEditing) {
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Salvar";
    saveButton.addEventListener("click", () => saveEdit(task.id, item.querySelector(".edit-input").value));

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";
    cancelButton.addEventListener("click", cancelEdit);

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);
  } else {
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => startEditing(task.id));
    actions.appendChild(editButton);
  }

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Excluir";
  removeButton.addEventListener("click", () => removeTask(task.id));

  actions.appendChild(removeButton);

  item.appendChild(checkbox);
  item.appendChild(content);
  item.appendChild(actions);

  return item;
}

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => {
      if (activeFilter === "pending") return !task.completed;
      if (activeFilter === "completed") return task.completed;
      return true;
    })
    .sort((a, b) => {
      const overdueA = isOverdue(a.task);
      const overdueB = isOverdue(b.task);
      if (overdueA === overdueB) return a.index - b.index;
      return overdueA ? -1 : 1;
    })
    .map(({ task }) => task);

  filtered.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  updateSummary();
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  summaryText.textContent = `${total} tarefas · ${pending} pendentes · ${completed} concluídas`;
}

function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  const task = {
    id: crypto.randomUUID(),
    title,
    priority: taskPriority.value,
    dueDate: taskDate.value,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskDate.value = "";
  taskPriority.value = "media";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  if (editingId === id) editingId = null;
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  if (editingId && !tasks.some((task) => task.id === editingId)) {
    editingId = null;
  }
  saveTasks();
  renderTasks();
}

function startEditing(id) {
  editingId = id;
  renderTasks();
}

function saveEdit(id, newTitle) {
  const title = newTitle.trim();
  if (!title) return;
  tasks = tasks.map((task) => (task.id === id ? { ...task, title } : task));
  editingId = null;
  saveTasks();
  renderTasks();
}

function cancelEdit() {
  editingId = null;
  renderTasks();
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderTasks();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});

clearCompletedButton.addEventListener("click", clearCompleted);

toggleThemeButton.addEventListener("click", toggleTheme);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

if (hero) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    hero.style.setProperty("--tilt-x", `${(x - 0.5) * 10}px`);
    hero.style.setProperty("--tilt-y", `${(y - 0.5) * 10}px`);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--tilt-x", "0px");
    hero.style.setProperty("--tilt-y", "0px");
  });
}

loadTasks();
loadTheme();
renderTasks();
