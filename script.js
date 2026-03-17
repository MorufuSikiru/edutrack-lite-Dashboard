


const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentTermInput = document.getElementById('studentTerm');
const subjectInput = document.getElementById('subject');
const scoreInput = document.getElementById('score');
const addBtn = document.getElementById('addBtn');
const resultBody = document.getElementById('resultBody');
const totalScoreEl = document.getElementById('totalScore');
const averageScoreEl = document.getElementById('averageScore');
const finalRemarkEl = document.getElementById('finalRemark');
const clearBtn = document.getElementById('clearBtn');
const toggleBtn = document.getElementById('toggleTheme');

let performanceChart;
let ctx;

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('performanceChart');
    if (canvas) {
        ctx = canvas.getContext('2d');
    }
});

let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
renderTable();
addBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    const studentClass = studentClassInput.value;
    const term = studentTermInput.value;
    const subject = subjectInput.value.trim();
    const scoreValue = scoreInput.value.trim();
    const score = Number(scoreValue);

    if (
        !name ||
        !studentClass ||
        !term ||
        !subject ||
        scoreValue === '' ||
        isNaN(score) ||
        score < 0 ||
        score > 100
    ) {
        alert('Please fill all fields correctly.');
        return;
    }

    const alreadyExists = subjects.some(item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.studentClass === studentClass &&
        item.term === term &&
        item.subject.toLowerCase() === subject.toLowerCase()
    );

    if (alreadyExists) {
        alert('This subject has already been added for this student in this term.');
        return;
    }

    subjects.push({ name, studentClass, term, subject, score });
    localStorage.setItem('subjects', JSON.stringify(subjects));

    subjectInput.selectedIndex = 0;
    scoreInput.value = '';

    renderTable();
});
function renderTable() {
    resultBody.innerHTML = '';
    let total = 0;

    subjects.forEach(item => {
        total += item.score;
        const grade = getGrade(item.score);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.studentClass}</td>
            <td>${item.term}</td>
            <td>${item.subject}</td>
            <td>${item.score}</td>
            <td>${grade}</td>
        `;
        resultBody.appendChild(row);
    });

    const average = subjects.length ? (total / subjects.length).toFixed(2) : 0;
    totalScoreEl.textContent = total;
    averageScoreEl.textContent = average;
    finalRemarkEl.textContent = getRemark(average);

    updateChart();
}

function getGrade(score) {
    if(score >= 70) return 'A';
    if(score >= 60) return 'B';
    if(score >= 50) return 'C';
    if(score >= 45) return 'D';
    if(score >= 40) return 'E';
    return 'F';
}

function getRemark(avg) {
    if(avg >= 70) return 'Excellent';
    if(avg >= 50) return 'Good';
    return 'Needs Improvement';
}

clearBtn.addEventListener('click', () => {
    subjects = [];
    localStorage.removeItem('subjects');
    renderTable();
});

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const printBtn = document.getElementById('printBtn');
const reportCard = document.getElementById('reportCard');
const reportTableBody = document.getElementById('reportTableBody');

const reportName = document.getElementById('reportName');
const reportClass = document.getElementById('reportClass');
const reportTerm = document.getElementById('reportTerm');

const reportTotal = document.getElementById('reportTotal');
const reportAverage = document.getElementById('reportAverage');
const reportRemark = document.getElementById('reportRemark');

printBtn.addEventListener('click', () => {

    if (subjects.length === 0) {
        alert("No results to generate report.");
        return;
    }

    reportCard.style.display = "block";
    reportTableBody.innerHTML = "";

    let total = 0;

    subjects.forEach(item => {
        total += item.score;
        const grade = getGrade(item.score);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.score}</td>
            <td>${grade}</td>
        `;
        reportTableBody.appendChild(row);

        reportName.textContent = item.name;
        reportClass.textContent = item.studentClass;
        reportTerm.textContent = item.term;
    });

    const average = (total / subjects.length).toFixed(2);

    reportTotal.textContent = total;
    reportAverage.textContent = average;
    reportRemark.textContent = getRemark(average);
    
    window.print();
});

function updateChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded.');
        return;
    }

    const ctx = canvas.getContext('2d');
    const labels = subjects.map(item => item.subject);
    const data = subjects.map(item => item.score);

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Scores',
                data: data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}