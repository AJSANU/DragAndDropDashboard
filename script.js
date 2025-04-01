let draggedCard = null;
let isEditMode = false;
let editCardId = null;

document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".task-list");

  loadTasksFromStorage();

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedCard) {
        column.appendChild(draggedCard);
        saveAllTasksToStorage();
        draggedCard = null;
      }
    });
  });

  document.getElementById("newTaskBtn").addEventListener("click", () => {
    document.getElementById("taskModal").style.display = "flex";
    isEditMode = false;
    document.getElementById("modalTitle").innerText = "Create New Task";
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("taskModal").style.display = "none";
  });

  document.getElementById("addTask").addEventListener("click", () => {
    const emoji = document.getElementById("taskEmoji").value || "📝";
    const title = document.getElementById("taskTitle").value || "Untitled";
    const desc = document.getElementById("taskDesc").value || "No description";
    const date = document.getElementById("taskDate").value || "N/A";

    if (isEditMode && editCardId) {
      const card = document.getElementById(editCardId);
      card.querySelector("h4").textContent = title;
      card.querySelector("p").textContent = desc;
      card.querySelector("span").textContent = date;
      card.querySelector(".emoji").textContent = emoji;
      isEditMode = false;
      editCardId = null;
    } else {
      const card = createCard({ emoji, title, desc, date });
      document.getElementById("backlog").appendChild(card);
    }

    document.getElementById("taskModal").style.display = "none";
    clearInputs();
    saveAllTasksToStorage();
  });
});

function createCard({ emoji, title, desc, date }) {
  const card = document.createElement("div");
  card.className = "card";
  const id = "card-" + Date.now();
  card.id = id;
  card.draggable = true;
  card.innerHTML = `
    <div class="emoji">${emoji}</div>
    <h4>${title}</h4>
    <p>${desc}</p>
    <span>${date}</span>
    <div class="actions">
      <button onclick="editTask('${id}')">Edit</button>
      <button onclick="deleteTask('${id}')">Delete</button>
    </div>
  `;

  card.addEventListener("dragstart", () => {
    draggedCard = card;
  });

  return card;
}

function editTask(id) {
  const card = document.getElementById(id);
  document.getElementById("taskEmoji").value = card.querySelector(".emoji").textContent;
  document.getElementById("taskTitle").value = card.querySelector("h4").textContent;
  document.getElementById("taskDesc").value = card.querySelector("p").textContent;
  document.getElementById("taskDate").value = card.querySelector("span").textContent;
  document.getElementById("taskModal").style.display = "flex";
  isEditMode = true;
  editCardId = id;
  document.getElementById("modalTitle").innerText = "Edit Task";
}

function deleteTask(id) {
  const card = document.getElementById(id);
  card.parentElement.removeChild(card);
  saveAllTasksToStorage();
}

function clearInputs() {
  document.getElementById("taskEmoji").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  document.getElementById("taskDate").value = "";
}

function saveAllTasksToStorage() {
  const columns = document.querySelectorAll(".task-list");
  const allTasks = {};

  columns.forEach((col) => {
    const id = col.id;
    allTasks[id] = [];
    col.querySelectorAll(".card").forEach((card) => {
      allTasks[id].push({
        id: card.id,
        emoji: card.querySelector(".emoji").textContent,
        title: card.querySelector("h4").textContent,
        desc: card.querySelector("p").textContent,
        date: card.querySelector("span").textContent
      });
    });
  });

  localStorage.setItem("jiraBoardTasks", JSON.stringify(allTasks));
}

function loadTasksFromStorage() {
  const data = JSON.parse(localStorage.getItem("jiraBoardTasks"));
  if (!data) return;

  Object.keys(data).forEach((listId) => {
    const list = document.getElementById(listId);
    data[listId].forEach((task) => {
      const card = createCard(task);
      card.id = task.id;
      list.appendChild(card);
    });
  });
}
