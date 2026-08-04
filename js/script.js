const checkboxes = document.querySelectorAll(
    '.mission-label input[type="checkbox"]'
);

const progressText = document.querySelector(".progress-header span");
const progressFill = document.querySelector(".progress-fill");

function updateProgress() {

    const totalMissions = checkboxes.length;

    const completedMissions = document.querySelectorAll(
        '.mission-label input[type="checkbox"]:checked'
    ).length;

    progressText.textContent =
        `${completedMissions} / ${totalMissions} Completed`;

    const percentage = (completedMissions / totalMissions) * 100;

    progressFill.style.width = `${percentage}%`;
}

for (const checkbox of checkboxes) {

    checkbox.addEventListener("change", function () {

        const missionCard = this.closest(".mission-card");

        missionCard.classList.toggle(
            "completed",
            this.checked
        );

        updateProgress();

    });

}

updateProgress();