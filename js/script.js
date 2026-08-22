// =========================
// CONSTANTS
// =========================

const STORAGE_KEY = "missionStates";
const USER_NAME = "Fazal";

// =========================
// ELEMENTS
// =========================

const checkboxes = document.querySelectorAll(
  '.mission-label input[type="checkbox"]',
);
const progressText = document.querySelector(".progress-header span");
const progressFill = document.querySelector(".progress-fill");
const missionCompleteMessage = document.querySelector(
  ".mission-complete-message",
);
const greeting = document.querySelector("#greeting");
const missionCards = document.querySelectorAll(".mission-card");

// =========================
// MISSION STATE
// =========================

let missionStates = [];

// =========================
// FUNCTIONS
// =========================

function updateProgress() {
  if (!progressText || !progressFill) {
    return;
  }

  const totalMissions = checkboxes.length;
  const completedMissions = document.querySelectorAll(
    '.mission-label input[type="checkbox"]:checked',
  ).length;

  progressText.textContent = `${completedMissions} / ${totalMissions} Completed`;

  progressFill.style.width = `${(completedMissions / totalMissions) * 100}%`;

  if (missionCompleteMessage) {
    if (completedMissions === totalMissions && totalMissions > 0) {
      missionCompleteMessage.style.display = "block";
    } else {
      missionCompleteMessage.style.display = "none";
    }
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missionStates));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function loadProgress() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (savedProgress) {
    const savedStates = JSON.parse(savedProgress);

    missionStates = savedStates.map((state) => {
      if (typeof state === "boolean") {
        return {
          completed: state,
          elapsedSeconds: 0,
          status: state ? "completed" : "not-started",
        };
      }

      return {
        completed: state.completed || false,
        elapsedSeconds: state.elapsedSeconds || 0,
        status: state.status || (state.completed ? "completed" : "not-started"),
      };
    });
  }

  while (missionStates.length < missionCards.length) {
    missionStates.push({
      completed: false,
      elapsedSeconds: 0,
      status: "not-started",
    });
  }

  for (let i = 0; i < missionCards.length; i++) {
    const missionCard = missionCards[i];
    const checkbox = missionCard.querySelector('input[type="checkbox"]');
    const timerDisplay = missionCard.querySelector(".mission-timer span");
    const missionState = missionStates[i];

    checkbox.checked = missionState.completed;

    timerDisplay.textContent = formatTime(missionState.elapsedSeconds);

    missionCard.classList.toggle("completed", missionState.completed);
  }

  updateProgress();
}

function updateGreeting() {
  if (!greeting) {
    return;
  }
  const hour = new Date().getHours();
  let message;

  if (hour >= 5 && hour < 12) {
    message = "🌅 Good Morning";
  } else if (hour >= 12 && hour < 18) {
    message = "☀️ Good Afternoon";
  } else if (hour >= 18 && hour < 21) {
    message = "🌇 Good Evening";
  } else {
    message = "🌙 Good Night";
  }

  greeting.textContent = `${message}, ${USER_NAME}`;
}

// =========================
// INITIALIZATION
// =========================

loadProgress();
updateGreeting();

// =========================
// CHECKBOX EVENTS
// =========================

for (let i = 0; i < checkboxes.length; i++) {
  const checkbox = checkboxes[i];

  checkbox.addEventListener("change", function () {
    const missionCard = this.closest(".mission-card");

    if (this.checked) {
      missionStates[i].completed = true;
      missionStates[i].status = "completed";

      missionCard.classList.add("completed");
    } else {
      missionStates[i].completed = false;
      missionStates[i].status = "not-started";
      missionStates[i].elapsedSeconds = 0;

      missionCard.classList.remove("completed");

      const startButton = missionCard.querySelector(".start-mission-btn");
      const pauseButton = missionCard.querySelector(".pause-mission-btn");
      const completeButton = missionCard.querySelector(".complete-mission-btn");
      const timerDisplay = missionCard.querySelector(".mission-timer span");

      startButton.style.display = "block";

      pauseButton.style.display = "none";
      pauseButton.textContent = "⏸ Pause";

      completeButton.style.display = "none";
      completeButton.textContent = "✓ Complete";
      completeButton.disabled = false;

      timerDisplay.textContent = "00:00";
    }

    updateProgress();
    saveProgress();
  });
}

// =========================
// MISSION EVENTS
// =========================

for (let i = 0; i < missionCards.length; i++) {
  const missionCard = missionCards[i];
  const missionState = missionStates[i];

  const startButton = missionCard.querySelector(".start-mission-btn");
  const pauseButton = missionCard.querySelector(".pause-mission-btn");
  const completeButton = missionCard.querySelector(".complete-mission-btn");
  const timerDisplay = missionCard.querySelector(".mission-timer span");

  let timerInterval = null;

  // =========================
  // RESTORE MISSION UI
  // =========================

  if (missionState.status === "completed") {
    startButton.style.display = "none";
    pauseButton.style.display = "none";
    completeButton.style.display = "block";
    completeButton.textContent = "✓ Completed";
    completeButton.disabled = true;
  } else if (missionState.status === "paused") {
    startButton.style.display = "none";
    pauseButton.style.display = "block";
    pauseButton.textContent = "▶ Resume";
    completeButton.style.display = "block";
    completeButton.disabled = false;
  } else if (missionState.status === "running") {
    startButton.style.display = "none";
    pauseButton.style.display = "block";
    pauseButton.textContent = "⏸ Pause";
    completeButton.style.display = "block";
    completeButton.disabled = false;
  } else {
    startButton.style.display = "block";
    pauseButton.style.display = "none";
    completeButton.style.display = "none";
    completeButton.disabled = false;
  }

  // =========================
  // TIMER
  // =========================

  function startTimer() {
    if (timerInterval !== null) {
      return;
    }

    timerInterval = setInterval(function () {
      missionState.elapsedSeconds++;

      timerDisplay.textContent = formatTime(missionState.elapsedSeconds);

      saveProgress();
    }, 1000);
  }

  // =========================
  // EXPAND / COLLAPSE
  // =========================

  missionCard.addEventListener("click", function (event) {
    if (event.target.closest('input[type="checkbox"]')) {
      return;
    }

    this.classList.toggle("expanded");
  });

  // =========================
  // START MISSION
  // =========================

  startButton.addEventListener("click", function (event) {
    event.stopPropagation();

    startButton.style.display = "none";
    pauseButton.style.display = "block";
    completeButton.style.display = "block";

    missionState.status = "running";

    startTimer();
    saveProgress();
  });

  // =========================
  // PAUSE / RESUME
  // =========================

  pauseButton.addEventListener("click", function (event) {
    event.stopPropagation();

    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;

      missionState.status = "paused";

      pauseButton.textContent = "▶ Resume";

      saveProgress();
    } else {
      missionState.status = "running";

      startTimer();

      pauseButton.textContent = "⏸ Pause";

      saveProgress();
    }
  });

  // =========================
  // COMPLETE MISSION
  // =========================

  completeButton.addEventListener("click", function (event) {
    event.stopPropagation();

    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    missionState.completed = true;
    missionState.status = "completed";

    const checkbox = missionCard.querySelector('input[type="checkbox"]');

    checkbox.checked = true;

    missionCard.classList.add("completed");

    updateProgress();
    saveProgress();

    completeButton.textContent = "✓ Completed";
    completeButton.disabled = true;

    pauseButton.style.display = "none";
  });
}

// =========================
// PROJECT DATA
// =========================

const PROJECT_STORAGE_KEY = "projects";
const projectForm = document.querySelector("#projectForm");
const projectsGrid = document.querySelector(".projects-grid");
const projectModal = document.querySelector("#projectModal");
const newProjectButton = document.querySelector(".new-project-btn");
const closeProjectModal = document.querySelector("#closeProjectModal");
const cancelProject = document.querySelector("#cancelProject");
const projectModalTitle = document.querySelector("#projectModalTitle");
const projectSubmitButton = document.querySelector("#projectSubmitButton");

let projects = [];
let editingProjectId = null;

function loadProjects() {
  const savedProjects = localStorage.getItem(PROJECT_STORAGE_KEY);

  if (savedProjects) {
    projects = JSON.parse(savedProjects);

    let updated = false;

    for (const project of projects) {
      if (!project.id) {
        project.id = Date.now() + Math.random();
        updated = true;
      }
    }

    if (updated) {
      saveProjects();
    }
  }

  if (projects.length === 0) {
    projects.push({
      id: Date.now(),
      name: "EngineerOS",
      description:
        "A developer-focused operating system for learning, practicing, building, and shipping.",
      status: "active",
      statusIcon: "🔵",
      statusText: "Active",
      tech: ["HTML", "CSS", "JavaScript"],
      nextStep: "Build the Projects module",
    });

    saveProjects();
  }
}

function saveProjects() {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  if (!projectsGrid) {
    return;
  }

  projectsGrid.innerHTML = "";

  for (const project of projects) {
    const projectCard = document.createElement("article");

    projectCard.className = "project-card";

    projectCard.innerHTML = `
            <div class="project-card-header">
                <span class="project-status ${project.status}">
                    ${project.statusIcon} ${project.statusText}
                </span>
            </div>

            <h3>${project.name}</h3>

            <p>${project.description}</p>

            <div class="project-tech">
                ${project.tech
                  .map((technology) => `<span>${technology}</span>`)
                  .join("")}
            </div>

            <div class="project-next">
                <strong>Next Step</strong>
                <span>${project.nextStep}</span>
            </div>

            <div class="project-actions">
    <button class="project-edit-btn" data-id="${project.id}">
        Edit
    </button>

    <button class="project-delete-btn" data-id="${project.id}">
        Delete
    </button>
</div>
        `;

    projectsGrid.appendChild(projectCard);
  }

  const editButtons = document.querySelectorAll(".project-edit-btn");

  for (const button of editButtons) {
    button.addEventListener("click", function () {
      editProject(this.dataset.id);
    });
  }

  const deleteButtons = document.querySelectorAll(".project-delete-btn");

  for (const button of deleteButtons) {
    button.addEventListener("click", function () {
      deleteProject(this.dataset.id);
    });
  }
}

function editProject(projectId) {
  const project = projects.find((project) => project.id == projectId);

  if (!project) {
    return;
  }

  editingProjectId = project.id;

  document.querySelector("#projectName").value = project.name;
  document.querySelector("#projectDescription").value = project.description;
  document.querySelector("#projectStatus").value = project.status;
  document.querySelector("#projectTech").value = project.tech.join(", ");
  document.querySelector("#projectNext").value = project.nextStep;

  projectModalTitle.textContent = "Edit Project";
  projectSubmitButton.textContent = "Save Changes";

  projectModal.classList.add("show");
}

function deleteProject(projectId) {
  const project = projects.find((project) => project.id == projectId);

  if (!project) {
    return;
  }

  const confirmed = confirm(
    `Delete "${project.name}"?\n\nThis cannot be undone.`,
  );

  if (!confirmed) {
    return;
  }

  projects = projects.filter((project) => project.id != projectId);

  saveProjects();
  renderProjects();
}

// =========================
// PROJECT MODAL
// =========================

if (projectModal && newProjectButton) {
  newProjectButton.addEventListener("click", function () {
    editingProjectId = null;
    projectForm.reset();
    projectModalTitle.textContent = "New Project";
    projectSubmitButton.textContent = "Create Project";

    projectModal.classList.add("show");
  });
}

if (projectModal && closeProjectModal) {
  closeProjectModal.addEventListener("click", function () {
    projectModal.classList.remove("show");
  });
}

if (projectModal && cancelProject) {
  cancelProject.addEventListener("click", function () {
    projectModal.classList.remove("show");
  });
}

// =========================
// CREATE PROJECT
// =========================

if (projectForm) {
  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#projectName").value.trim();
    const description = document
      .querySelector("#projectDescription")
      .value.trim();
    const status = document.querySelector("#projectStatus").value;
    const tech = document
      .querySelector("#projectTech")
      .value.split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const nextStep = document.querySelector("#projectNext").value.trim();

    const statusData = {
      planning: {
        icon: "🟡",
        text: "Planning",
      },
      active: {
        icon: "🔵",
        text: "Active",
      },
      completed: {
        icon: "🟢",
        text: "Completed",
      },
    };

    const project = {
      id: Date.now(),
      name: name,
      description: description,
      status: status,
      statusIcon: statusData[status].icon,
      statusText: statusData[status].text,
      tech: tech,
      nextStep: nextStep,
    };

    if (editingProjectId !== null) {
      const projectIndex = projects.findIndex(
        (project) => project.id == editingProjectId,
      );

      if (projectIndex !== -1) {
        projects[projectIndex] = {
          id: projects[projectIndex].id,
          name: name,
          description: description,
          status: status,
          statusIcon: statusData[status].icon,
          statusText: statusData[status].text,
          tech: tech,
          nextStep: nextStep,
        };
      }

      editingProjectId = null;
    } else {
      projects.push(project);
    }

    saveProjects();
    renderProjects();

    projectForm.reset();
    projectModal.classList.remove("show");
  });
}

// =========================
// PROJECT INITIALIZATION
// =========================

if (projectForm) {
  loadProjects();
  renderProjects();
}

// =========================
// DSA PROBLEMS
// =========================

const DSA_STORAGE_KEY = "dsaProblems";
const arrayProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Find two numbers in an array that add up to a target value.",
    topics: ["Array", "Hash Table"],
    status: "not-started",
    url: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description:
      "Find the maximum profit from buying and selling a stock once.",
    topics: ["Array", "Greedy"],
    status: "not-started",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: 3,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum.",
    topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
    status: "not-started",
    url: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: 4,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description:
      "Return an array where each element is the product of all other elements.",
    topics: ["Array", "Prefix Sum"],
    status: "not-started",
    url: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    id: 5,
    title: "Contains Duplicate",
    difficulty: "Easy",
    description:
      "Determine whether any value appears at least twice in an array.",
    topics: ["Array", "Hash Table"],
    status: "not-started",
    url: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    id: 6,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest product.",
    topics: ["Array", "Dynamic Programming"],
    status: "not-started",
    url: "https://leetcode.com/problems/maximum-product-subarray/",
  },
  {
    id: 7,
    title: "Move Zeroes",
    difficulty: "Easy",
    description:
      "Move all zeroes to the end of the array while maintaining the order of non-zero elements.",
    topics: ["Array", "Two Pointers"],
    status: "not-started",
    url: "https://leetcode.com/problems/move-zeroes/",
  },
  {
    id: 8,
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate the array to the right by k steps.",
    topics: ["Array", "Math", "Two Pointers"],
    status: "not-started",
    url: "https://leetcode.com/problems/rotate-array/",
  },
];
const arrayProblemsContainer = document.querySelector(".array-problems");

function loadArrayProblems() {
  const savedProblems = localStorage.getItem(DSA_STORAGE_KEY);

  if (savedProblems) {
    const savedData = JSON.parse(savedProblems);

    for (const problem of arrayProblems) {
      const savedProblem = savedData.find(
        (savedProblem) => savedProblem.id === problem.id,
      );

      if (savedProblem) {
        problem.status = savedProblem.status;
      }
    }
  }
}

function updateArrayProgress() {
  const total = arrayProblems.length;

  const solved = arrayProblems.filter(
    (problem) => problem.status === "solved",
  ).length;

  const inProgress = arrayProblems.filter(
    (problem) => problem.status === "in-progress",
  ).length;

  const progressPercent = total === 0 ? 0 : Math.round((solved / total) * 100);

  document.querySelector("#arrayTotal").textContent = total;
  document.querySelector("#arraySolved").textContent = solved;
  document.querySelector("#arrayInProgress").textContent = inProgress;

  document.querySelector("#arrayProgressPercent").textContent =
    `${progressPercent}%`;

  document.querySelector("#arrayProgressFill").style.width =
    `${progressPercent}%`;
}

function renderArrayProblems() {
  if (!arrayProblemsContainer) {
    return;
  }

  arrayProblemsContainer.innerHTML = "";

  for (const problem of arrayProblems) {
    const problemCard = document.createElement("article");

    problemCard.className = "dsa-problem-card";

    problemCard.innerHTML = `
            <div class="dsa-problem-header">
    <div class="dsa-problem-title">
        <h4>${problem.title}</h4>

        <span class="problem-difficulty ${problem.difficulty.toLowerCase()}">
            ${problem.difficulty}
        </span>
    </div>

    <p>${problem.description}</p>
</div>

            <div class="dsa-problem-topics">
                ${problem.topics
                  .map((topic) => `<span>${topic}</span>`)
                  .join("")}
            </div>

            <div class="dsa-problem-footer">
              <select
    class="problem-status-select status-${problem.status}"
    data-id="${problem.id}"
>
        <option value="not-started" ${problem.status === "not-started" ? "selected" : ""}>
            Not Started
        </option>
        <option value="in-progress" ${problem.status === "in-progress" ? "selected" : ""}>
            In Progress
        </option>
        <option value="solved" ${problem.status === "solved" ? "selected" : ""}>
            Solved
        </option>
    </select>

    <button class="problem-solve-btn" data-url="${problem.url}">
        Solve
    </button>
</div>
        `;

    arrayProblemsContainer.appendChild(problemCard);
  }
}

function setupProblemButtons() {
  if (!arrayProblemsContainer) {
    return;
  }

  const solveButtons =
    arrayProblemsContainer.querySelectorAll(".problem-solve-btn");

  for (const button of solveButtons) {
    button.addEventListener("click", function () {
      window.open(this.dataset.url, "_blank");
    });
  }
}

function setupProblemStatus() {
  if (!arrayProblemsContainer) {
    return;
  }

  const statusSelects = arrayProblemsContainer.querySelectorAll(
    ".problem-status-select",
  );

  for (const select of statusSelects) {
    select.addEventListener("change", function () {
      const problemId = Number(this.dataset.id);
      const problem = arrayProblems.find((problem) => problem.id === problemId);

      if (!problem) {
        return;
      }

      problem.status = this.value;

      this.classList.remove(
        "status-not-started",
        "status-in-progress",
        "status-solved",
      );

      this.classList.add(`status-${problem.status}`);

      localStorage.setItem(DSA_STORAGE_KEY, JSON.stringify(arrayProblems));

      updateArrayProgress();
    });
  }
}

if (arrayProblemsContainer) {
  loadArrayProblems();
  renderArrayProblems();
  setupProblemButtons();
  setupProblemStatus();
  updateArrayProgress();
}
