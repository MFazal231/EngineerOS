// =========================
// CONSTANTS
// =========================

const STORAGE_KEY = "missionStates";
const USER_NAME = "Fazal";


// =========================
// ELEMENTS
// =========================

const checkboxes = document.querySelectorAll(
    '.mission-label input[type="checkbox"]'
);

const progressText = document.querySelector(
    ".progress-header span"
);

const progressFill = document.querySelector(
    ".progress-fill"
);

const greeting = document.querySelector("#greeting");

const missionCards = document.querySelectorAll(".mission-card");

// =========================
// FUNCTIONS
// =========================

function updateProgress() {

    const totalMissions = checkboxes.length;

    const completedMissions = document.querySelectorAll(
        '.mission-label input[type="checkbox"]:checked'
    ).length;

    progressText.textContent =
        `${completedMissions} / ${totalMissions} Completed`;

    progressFill.style.width =
        `${(completedMissions / totalMissions) * 100}%`;

}


function saveProgress() {

    const missionStates = [];

    for (const checkbox of checkboxes) {

        missionStates.push(checkbox.checked);

    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(missionStates)
    );

}


function loadProgress() {

    const savedProgress = localStorage.getItem(
        STORAGE_KEY
    );

    if (!savedProgress) {

        updateProgress();

        return;

    }

    const missionStates = JSON.parse(savedProgress);

    for (let i = 0; i < checkboxes.length; i++) {

        checkboxes[i].checked = missionStates[i];

        const missionCard =
            checkboxes[i].closest(".mission-card");

        missionCard.classList.toggle(
            "completed",
            missionStates[i]
        );

    }

    updateProgress();

}

function updateGreeting() {

    const now = new Date();

    const hour = now.getHours();

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
// EVENTS
// =========================

for (const checkbox of checkboxes) {

    checkbox.addEventListener("change", function () {

        const missionCard =
            this.closest(".mission-card");

        missionCard.classList.toggle(
            "completed",
            this.checked
        );

        updateProgress();

        saveProgress();

    });

}

for (const missionCard of missionCards) {

    missionCard.addEventListener("click", function (event) {

        if (event.target.closest('input[type="checkbox"]')) {

            return;

        }

        this.classList.toggle("expanded");

    });


    const startButton =
        missionCard.querySelector(".start-mission-btn");

    const pauseButton =
        missionCard.querySelector(".pause-mission-btn");

    const completeButton =
        missionCard.querySelector(".complete-mission-btn");


    startButton.addEventListener("click", function (event) {

        event.stopPropagation();

        startButton.style.display = "none";

        pauseButton.style.display = "block";

        completeButton.style.display = "block";

    });


    pauseButton.addEventListener("click", function (event) {

        event.stopPropagation();

        if (pauseButton.textContent.includes("Pause")) {

            pauseButton.textContent = "▶ Resume";

        } else {

            pauseButton.textContent = "⏸ Pause";

        }

    });

}


// =========================
// INITIALIZATION
// =========================

function init() {

    loadProgress();

    updateGreeting();

}

init();