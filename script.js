let draggedCard = null;

document.addEventListener("DOMContentLoaded", () => {
  const columns = document.querySelectorAll(".task-list");

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedCard) {
        column.appendChild(draggedCard);
        draggedCard = null;
      }
    });
  });

  document.getElementById("newTaskBtn").addEventListener("click", () => {
    document.getElementById("taskModal").style.display = "flex";
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("taskModal").style.display = "none";
  });

  document.getElementById("addTask").addEventListener("click", () => {
    const emoji = document.getElementById("taskEmoji").value || "📝";
    const title = document.getElementById("taskTitle").value || "Untitled";
    const desc = document.getElementById("taskDesc").value || "No description";
    const date = document.getElementById("taskDate").value || "N/A";

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.innerHTML = `
      <div class="emoji">${emoji}</div>
      <h4>${title}</h4>
      <p>${desc}</p>
      <span>${date}</span>
    `;

    card.addEventListener("dragstart", () => {
      draggedCard = card;
    });

    document.getElementById("backlog").appendChild(card);
    document.getElementById("taskModal").style.display = "none";

    document.getElementById("taskEmoji").value = "";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskDate").value = "";
  });

  // Initial cards (optional)
  const initialTasks = [
    {
      emoji: "💪",
      title: "Ads Campaign",
      desc: "Ads for new product",
      date: "Feb 12 → Feb 24"
    },
    {
      emoji: "🚀",
      title: "UI Redesign",
      desc: "Design iterations in Figma",
      date: "Oct 12 → Oct 23",
      listId: "planning"
    },
    {
      emoji: "⚙️",
      title: "Infrastructure",
      desc: "Prepare the AWS infra.",
      date: "May 28 → Jun 14",
      listId: "done"
    },
    {
      emoji: "🤖",
      title: "AI Assistant",
      desc: "Implement AI in the platform",
      date: "Sep 28 → Oct 23",
      listId: "done"
    }
  ];

  initialTasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.innerHTML = `
      <div class="emoji">${task.emoji}</div>
      <h4>${task.title}</h4>
      <p>${task.desc}</p>
      <span>${task.date}</span>
    `;
    card.addEventListener("dragstart", () => {
      draggedCard = card;
    });

    const listId = task.listId || "backlog";
    document.getElementById(listId).appendChild(card);
  });
});
