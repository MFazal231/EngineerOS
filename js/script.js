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
const BINARY_SEARCH_STORAGE_KEY = "engineerOSBinarySearchProblems";
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
  {
    id: 9,
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Determine whether two strings are anagrams of each other.",
    topics: ["Hash Table", "String", "Sorting"],
    status: "not-started",
    url: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    id: 10,
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    description: "Return the unique elements that appear in both arrays.",
    topics: ["Array", "Hash Table", "Two Pointers"],
    status: "not-started",
    url: "https://leetcode.com/problems/intersection-of-two-arrays/",
  },
  {
    id: 11,
    title: "Majority Element",
    difficulty: "Easy",
    description:
      "Find the element that appears more than half of the time in the array.",
    topics: ["Array", "Hash Table", "Sorting"],
    status: "not-started",
    url: "https://leetcode.com/problems/majority-element/",
  },
  {
    id: 12,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description:
      "Merge two sorted arrays into the first array in sorted order.",
    topics: ["Array", "Two Pointers", "Sorting"],
    status: "not-started",
    url: "https://leetcode.com/problems/merge-sorted-array/",
  },
  {
    id: 13,
    title: "3Sum",
    difficulty: "Medium",
    description: "Find all unique triplets in the array that add up to zero.",
    topics: ["Array", "Two Pointers", "Sorting"],
    status: "not-started",
    url: "https://leetcode.com/problems/3sum/",
  },
  {
    id: 14,
    title: "Container With Most Water",
    difficulty: "Medium",
    description:
      "Find two lines that together with the x-axis form a container holding the most water.",
    topics: ["Array", "Two Pointers", "Greedy"],
    status: "not-started",
    url: "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    id: 15,
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: "Count the number of subarrays whose sum equals k.",
    topics: ["Array", "Hash Table", "Prefix Sum"],
    status: "not-started",
    url: "https://leetcode.com/problems/subarray-sum-equals-k/",
  },
  {
    id: 16,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Calculate how much rainwater can be trapped between the bars of an elevation map.",
    topics: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    status: "not-started",
    url: "https://leetcode.com/problems/trapping-rain-water/",
  },
];
const binarySearchProblems = [
  {
    id: 1,
    title: "Binary Search",
    difficulty: "Easy",
    description: "Search for a target value in a sorted array.",
    topics: ["Array", "Binary Search"],
    status: "not-started",
    url: "https://leetcode.com/problems/binary-search/",
  },
  {
    id: 2,
    title: "Search Insert Position",
    difficulty: "Easy",
    description:
      "Find the index where a target should be inserted in a sorted array.",
    topics: ["Array", "Binary Search"],
    status: "not-started",
    url: "https://leetcode.com/problems/search-insert-position/",
  },
  {
    id: 3,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Search for a target in a rotated sorted array.",
    topics: ["Array", "Binary Search"],
    status: "not-started",
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  },
  {
    id: 4,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Find the minimum element in a rotated sorted array.",
    topics: ["Array", "Binary Search"],
    status: "not-started",
    url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  },
  {
    id: 5,
    title: "Find Peak Element",
    difficulty: "Medium",
    description: "Find a peak element in an array using binary search.",
    topics: ["Array", "Binary Search"],
    status: "not-started",
    url: "https://leetcode.com/problems/find-peak-element/",
  },
  {
    id: 6,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    description:
      "Find the minimum eating speed needed to finish all bananas within the given hours.",
    topics: ["Binary Search", "Greedy"],
    status: "not-started",
    url: "https://leetcode.com/problems/koko-eating-bananas/",
  },
  {
    id: 7,
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    description:
      "Find the minimum ship capacity needed to deliver all packages within the given number of days.",
    topics: ["Binary Search", "Greedy"],
    status: "not-started",
    url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
  },
];
const dsaTopics = {
  arrays: {
    problems: arrayProblems,
    storageKey: DSA_STORAGE_KEY,
  },

  "binary-search": {
    problems: binarySearchProblems,
    storageKey: BINARY_SEARCH_STORAGE_KEY,
  },
};
const arrayProblemsContainer = document.querySelector(".array-problems");
const binarySearchProblemsContainer = document.querySelector(
  ".binary-search-problems",
);
const binarySearchProblemSearch = document.querySelector(
  "#binarySearchProblemSearch",
);
const binarySearchResetFiltersButton = document.querySelector(
  "#resetBinarySearchFilters",
);
const resetFiltersButton = document.querySelector("#resetFilters");
const problemSearch = document.querySelector("#problemSearch");
const problemSort = document.querySelector("#problemSort");
const binarySearchProblemSort = document.querySelector(
  "#binarySearchProblemSort",
);
const arrayProgressElements = {
  total: document.querySelector("#arrayTotal"),
  solved: document.querySelector("#arraySolved"),
  inProgress: document.querySelector("#arrayInProgress"),
  percent: document.querySelector("#arrayProgressPercent"),
  fill: document.querySelector("#arrayProgressFill"),
};
const arraysTopicProgressElements = {
  percent: document.querySelector("#arraysTopicProgressPercent"),
  fill: document.querySelector("#arraysTopicProgressFill"),
  text: document.querySelector("#arraysTopicProgressText"),
};
const binarySearchTopicProgressElements = {
  percent: document.querySelector("#binarySearchTopicProgressPercent"),
  fill: document.querySelector("#binarySearchTopicProgressFill"),
  text: document.querySelector("#binarySearchTopicProgressText"),
};
const binarySearchProgressElements = {
  total: document.querySelector("#binarySearchTotal"),
  solved: document.querySelector("#binarySearchSolved"),
  inProgress: document.querySelector("#binarySearchInProgress"),
  percent: document.querySelector("#binarySearchProgressPercent"),
  fill: document.querySelector("#binarySearchProgressFill"),
};

const dsaFilterState = {
  arrays: {
    difficulty: "all",
    status: "all",
    search: "",
    sort: "default",
  },

  "binary-search": {
    difficulty: "all",
    status: "all",
    search: "",
    sort: "default",
  },
};

function loadDSAProblems(topic) {
  const topicData = dsaTopics[topic];

  if (!topicData) {
    return;
  }

  const savedProblems = localStorage.getItem(topicData.storageKey);

  if (!savedProblems) {
    return;
  }

  const savedData = JSON.parse(savedProblems);

  for (const problem of topicData.problems) {
    const savedProblem = savedData.find(
      (savedProblem) => savedProblem.id === problem.id,
    );

    if (savedProblem) {
      problem.status = savedProblem.status;
    }
  }
}

function updateDSAProgress(topic, elements) {
  const topicData = dsaTopics[topic];

  if (!topicData || !elements) {
    return;
  }

  const total = topicData.problems.length;

  const solved = topicData.problems.filter(
    (problem) => problem.status === "solved",
  ).length;

  const inProgress = topicData.problems.filter(
    (problem) => problem.status === "in-progress",
  ).length;

  const progressPercent = total === 0 ? 0 : Math.round((solved / total) * 100);

  elements.total.textContent = total;
  elements.solved.textContent = solved;
  elements.inProgress.textContent = inProgress;

  elements.percent.textContent = `${progressPercent}%`;

  elements.fill.style.width = `${progressPercent}%`;
}

function renderDSAProblems(problems, container) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  for (const problem of problems) {
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
        ${problem.topics.map((topic) => `<span>${topic}</span>`).join("")}
      </div>

      <div class="dsa-problem-footer">
        <select
          class="problem-status-select status-${problem.status}"
          data-id="${problem.id}"
        >
          <option value="not-started" ${
            problem.status === "not-started" ? "selected" : ""
          }>
            Not Started
          </option>

          <option value="in-progress" ${
            problem.status === "in-progress" ? "selected" : ""
          }>
            In Progress
          </option>

          <option value="solved" ${
            problem.status === "solved" ? "selected" : ""
          }>
            Solved
          </option>
        </select>

        <button class="problem-solve-btn" data-url="${problem.url}">
          Solve
        </button>
      </div>
    `;

    container.appendChild(problemCard);
  }
}

function renderDSAProblemsWithFilters(topic, container) {
  if (!container) {
    return;
  }

  const topicData = dsaTopics[topic];
  const filters = dsaFilterState[topic];

  if (!topicData || !filters) {
    return;
  }

  const filteredProblems = topicData.problems.filter((problem) => {
    const searchText = filters.search.toLowerCase();

    const matchesSearch =
      problem.title.toLowerCase().includes(searchText) ||
      problem.description.toLowerCase().includes(searchText) ||
      problem.topics.some((topic) => topic.toLowerCase().includes(searchText));

    const matchesDifficulty =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    const matchesStatus =
      filters.status === "all" || problem.status === filters.status;

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  if (filters.sort === "name-asc") {
    filteredProblems.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (filters.sort === "name-desc") {
    filteredProblems.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (filters.sort === "difficulty") {
    const difficultyOrder = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };

    filteredProblems.sort(
      (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
    );
  }

  if (filters.sort === "status") {
    const statusOrder = {
      "not-started": 1,
      "in-progress": 2,
      solved: 3,
    };

    filteredProblems.sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status],
    );
  }

  container.innerHTML = "";

  if (filteredProblems.length === 0) {
    container.innerHTML = `
      <div class="problem-empty-state">
        <strong>No problems found</strong>
        <span>No problems match your current filters.</span>
      </div>
    `;

    return;
  }

  renderDSAProblems(filteredProblems, container);
}

function setupDSAFilters(topic, container) {
  if (!container) {
    return;
  }

  const filters = dsaFilterState[topic];

  if (!filters) {
    return;
  }

  const difficultyButtons = document.querySelectorAll(".difficulty-filter");

  const statusButtons = document.querySelectorAll(".status-filter");

  for (const button of difficultyButtons) {
    button.addEventListener("click", function () {
      filters.difficulty = this.dataset.difficulty;

      for (const difficultyButton of difficultyButtons) {
        difficultyButton.classList.remove("active");
      }

      this.classList.add("active");

      renderDSAProblemsWithFilters(topic, container);
      setupDSAButtons(container);
      setupDSAStatus(topic, container);
    });
  }

  for (const button of statusButtons) {
    button.addEventListener("click", function () {
      filters.status = this.dataset.status;

      for (const statusButton of statusButtons) {
        statusButton.classList.remove("active");
      }

      this.classList.add("active");

      renderDSAProblemsWithFilters(topic, container);
      setupDSAButtons(container);
      setupDSAStatus(topic, container);
    });
  }
}

function setupDSASearch(topic, container, searchInput) {
  if (!container || !searchInput) {
    return;
  }

  const filters = dsaFilterState[topic];

  if (!filters) {
    return;
  }

  searchInput.addEventListener("input", function () {
    filters.search = this.value.trim();

    renderDSAProblemsWithFilters(topic, container);
    setupDSAButtons(container);
    setupDSAStatus(topic, container);
  });
}

function setupDSAResetFilters(
  topic,
  container,
  searchInput,
  sortSelect,
  resetButton,
) {
  if (!container || !searchInput || !sortSelect || !resetButton) {
    return;
  }

  const filters = dsaFilterState[topic];

  if (!filters) {
    return;
  }

  resetButton.addEventListener("click", function () {
    filters.difficulty = "all";
    filters.status = "all";
    filters.search = "";
    filters.sort = "default";

    searchInput.value = "";
    sortSelect.value = "default";

    const difficultyButtons = document.querySelectorAll(".difficulty-filter");

    const statusButtons = document.querySelectorAll(".status-filter");

    for (const button of difficultyButtons) {
      button.classList.remove("active");
    }

    for (const button of statusButtons) {
      button.classList.remove("active");
    }

    const allDifficultyButton = document.querySelector(
      '.difficulty-filter[data-difficulty="all"]',
    );

    const allStatusButton = document.querySelector(
      '.status-filter[data-status="all"]',
    );

    if (allDifficultyButton) {
      allDifficultyButton.classList.add("active");
    }

    if (allStatusButton) {
      allStatusButton.classList.add("active");
    }

    renderDSAProblemsWithFilters(topic, container);
    setupDSAButtons(container);
    setupDSAStatus(topic, container);
  });
}

function setupDSAButtons(container) {
  if (!container) {
    return;
  }

  const solveButtons = container.querySelectorAll(".problem-solve-btn");

  for (const button of solveButtons) {
    button.addEventListener("click", function () {
      window.open(this.dataset.url, "_blank");
    });
  }
}

function setupDSAStatus(
  topic,
  container,
  progressElements,
  topicProgressElements,
) {
  if (!container) {
    return;
  }

  const topicData = dsaTopics[topic];

  if (!topicData) {
    return;
  }

  const statusSelects = container.querySelectorAll(".problem-status-select");

  for (const select of statusSelects) {
    select.addEventListener("change", function () {
      const problemId = Number(this.dataset.id);

      const problem = topicData.problems.find(
        (problem) => problem.id === problemId,
      );

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

      localStorage.setItem(
        topicData.storageKey,
        JSON.stringify(topicData.problems),
      );

      updateDSAProgress(topic, progressElements);

      updateDSATopicProgress(topic, topicProgressElements);
    });
  }
}

function setupDSASort(topic, container, sortSelect) {
  if (!container || !sortSelect) {
    return;
  }

  const filters = dsaFilterState[topic];

  if (!filters) {
    return;
  }

  sortSelect.addEventListener("change", function () {
    filters.sort = this.value;

    renderDSAProblemsWithFilters(topic, container);
    setupDSAButtons(container);
    setupDSAStatus(topic, container, progressElements, topicProgressElements);
  });
}

function updateDSATopicProgress(topic, elements) {
  const topicData = dsaTopics[topic];

  if (
    !topicData ||
    !elements ||
    !elements.percent ||
    !elements.fill ||
    !elements.text
  ) {
    return;
  }

  const total = topicData.problems.length;

  const solved = topicData.problems.filter(
    (problem) => problem.status === "solved",
  ).length;

  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);

  elements.percent.textContent = `${percentage}%`;
  elements.fill.style.width = `${percentage}%`;
  elements.text.textContent = `${solved} / ${total} solved`;
}

loadDSAProblems("arrays");
loadDSAProblems("binary-search");

if (arrayProblemsContainer) {
  renderDSAProblemsWithFilters("arrays", arrayProblemsContainer);
  setupDSAButtons(arrayProblemsContainer);
  setupDSAStatus(
    "arrays",
    arrayProblemsContainer,
    arrayProgressElements,
    arraysTopicProgressElements,
  );
  setupDSAFilters("arrays", arrayProblemsContainer);
  setupDSASearch("arrays", arrayProblemsContainer, problemSearch);
  setupDSASort("arrays", arrayProblemsContainer, problemSort);
  setupDSAResetFilters(
    "arrays",
    arrayProblemsContainer,
    problemSearch,
    problemSort,
    resetFiltersButton,
  );
  updateDSAProgress("arrays", arrayProgressElements);
}
updateDSATopicProgress("arrays", arraysTopicProgressElements);
updateDSATopicProgress("binary-search", binarySearchTopicProgressElements);

if (binarySearchProblemsContainer) {
  loadDSAProblems("binary-search");
  renderDSAProblemsWithFilters("binary-search", binarySearchProblemsContainer);
  setupDSAButtons(binarySearchProblemsContainer);
  setupDSAStatus(
    "binary-search",
    binarySearchProblemsContainer,
    binarySearchProgressElements,
    binarySearchTopicProgressElements,
  );
  setupDSAFilters("binary-search", binarySearchProblemsContainer);
  setupDSASearch(
    "binary-search",
    binarySearchProblemsContainer,
    binarySearchProblemSearch,
  );
  setupDSASort(
    "binary-search",
    binarySearchProblemsContainer,
    binarySearchProblemSort,
  );
  setupDSAResetFilters(
    "binary-search",
    binarySearchProblemsContainer,
    binarySearchProblemSearch,
    binarySearchProblemSort,
    binarySearchResetFiltersButton,
  );
  updateDSAProgress("binary-search", binarySearchProgressElements);
}

// String.prototype.replaceAll = function (search, replacement) {
//   const target = this;
//   return target.split(search).join(replacement);
// };