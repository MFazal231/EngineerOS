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
const progressText = document.querySelector(".progress-header span");
const progressFill = document.querySelector(".progress-fill");
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
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(missionStates)
    );
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

        missionStates = savedStates.map(state => {
            if (typeof state === "boolean") {
                return {
                    completed: state,
                    elapsedSeconds: 0,
                    status: state ? "completed" : "not-started"
                };
            }

            return {
                completed: state.completed || false,
                elapsedSeconds: state.elapsedSeconds || 0,
                status: state.status || (
                    state.completed
                        ? "completed"
                        : "not-started"
                )
            };
        });
    }

    while (missionStates.length < missionCards.length) {
        missionStates.push({
            completed: false,
            elapsedSeconds: 0,
            status: "not-started"
        });
    }

    for (let i = 0; i < missionCards.length; i++) {
        const missionCard = missionCards[i];
        const checkbox = missionCard.querySelector(
            'input[type="checkbox"]'
        );
        const timerDisplay = missionCard.querySelector(
            ".mission-timer span"
        );
        const missionState = missionStates[i];

        checkbox.checked = missionState.completed;

        timerDisplay.textContent =
            formatTime(missionState.elapsedSeconds);

        missionCard.classList.toggle(
            "completed",
            missionState.completed
        );
    }

    updateProgress();
}

function updateGreeting() {
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

        missionStates[i].completed = this.checked;

        if (this.checked) {
            missionStates[i].status = "completed";
        } else {
            missionStates[i].status = "not-started";
        }

        missionCard.classList.toggle(
            "completed",
            this.checked
        );

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

    const startButton = missionCard.querySelector(
        ".start-mission-btn"
    );
    const pauseButton = missionCard.querySelector(
        ".pause-mission-btn"
    );
    const completeButton = missionCard.querySelector(
        ".complete-mission-btn"
    );
    const timerDisplay = missionCard.querySelector(
        ".mission-timer span"
    );

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

            timerDisplay.textContent =
                formatTime(missionState.elapsedSeconds);

            saveProgress();
        }, 1000);
    }

    // =========================
    // EXPAND / COLLAPSE
    // =========================

    missionCard.addEventListener("click", function (event) {
        if (
            event.target.closest(
                'input[type="checkbox"]'
            )
        ) {
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

        const checkbox = missionCard.querySelector(
            'input[type="checkbox"]'
        );

        checkbox.checked = true;

        missionCard.classList.add("completed");

        updateProgress();
        saveProgress();

        completeButton.textContent = "✓ Completed";
        completeButton.disabled = true;

        pauseButton.style.display = "none";
    });
}