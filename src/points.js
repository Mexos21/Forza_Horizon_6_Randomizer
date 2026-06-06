let honorPoints = 0;
let pointsDisplay = null;

export function setPointsDisplay(element) {
    pointsDisplay = element;
    loadPoints();
}

function loadPoints() {
    const saved = localStorage.getItem('honorPoints');
    honorPoints = saved ? parseInt(saved, 10) : 0;
    updatePointsDisplay();
}

function updatePointsDisplay() {
    if (pointsDisplay) pointsDisplay.innerText = honorPoints;
}

export function addPoints(amount) {
    honorPoints += amount;
    localStorage.setItem('honorPoints', honorPoints);
    updatePointsDisplay();
}

export function resetPoints() {
    honorPoints = 0;
    localStorage.setItem('honorPoints', 0);
    updatePointsDisplay();
}