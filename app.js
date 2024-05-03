// Male inputs
let heightMale = document.getElementById('height_male');
let weightMale = document.getElementById('weight_male');
let maleRun = document.getElementById('male_run');

// Female inputs
let heightFemale = document.getElementById('height_female');
let weightFemale = document.getElementById('weight_female');
let femaleRun = document.getElementById('female_run');

// Male sliders
let heightSliderMale = document.getElementById('height_slider_male');
let weightSliderMale = document.getElementById('weight_slider_male');

// Female sliders
let heightSliderFemale = document.getElementById('height_slider_female');
let weightSliderFemale = document.getElementById('weight_slider_female');

// Center display elements
let bmiValue = document.getElementById('bmi_value');
let statusBtn = document.getElementById('status_btn');
let adviceText = document.getElementById('advice_text');
let speedmeter = document.getElementsByClassName('speedmeter')[0];
let needle = document.getElementsByClassName('needle')[0];

// Sync Male inputs with sliders
heightMale.addEventListener('input', () => { heightSliderMale.value = heightMale.value; });
heightSliderMale.addEventListener('input', () => { heightMale.value = heightSliderMale.value; });

weightMale.addEventListener('input', () => { weightSliderMale.value = weightMale.value; });
weightSliderMale.addEventListener('input', () => { weightMale.value = weightSliderMale.value; });

// Sync Female inputs with sliders
heightFemale.addEventListener('input', () => { heightSliderFemale.value = heightFemale.value; });
heightSliderFemale.addEventListener('input', () => { heightFemale.value = heightSliderFemale.value; });

weightFemale.addEventListener('input', () => { weightSliderFemale.value = weightFemale.value; });
weightSliderFemale.addEventListener('input', () => { weightFemale.value = weightSliderFemale.value; });

// Theme Toggle Function
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle').textContent = isDark ? '☀️' : '🌙';
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
    loadHistory();
});

// Calculate BMI function
function calculateBMI(gender, height, weight) {
    let heightInMeters = height / 100;
    let bmi = weight / (heightInMeters * heightInMeters);

    bmiValue.innerText = bmi.toFixed(2);

    // Calculate needle rotation (-90 to 90 degrees)
    let needleRotation = -90 + ((bmi - 10) * 180 / 30);

    // Limit needle rotation
    if (needleRotation > 90) {
        needleRotation = 90;
    } else if (needleRotation < -90) {
        needleRotation = -90;
    }

    needle.style.transform = `rotate(${needleRotation}deg)`;

    let border = '13px solid #000';
    let statusText = 'Normal';
    let statusColor = 'yellowgreen';
    let advice = '';

    // BMI categories (adjusted slightly for females)
    const normalLimit = gender === 'Female' ? 24 : 25;

    if (bmi < 18.5) {
        border = '13px solid #3b82f6';
        statusText = 'Underweight';
        statusColor = '#3b82f6';
        advice = 'You should increase your calorie intake and consider strength training exercises.';
    } else if (bmi >= 18.5 && bmi < normalLimit) {
        border = '13px solid yellowgreen';
        statusText = 'Normal';
        statusColor = 'yellowgreen';
        advice = 'Great job! Maintain your healthy lifestyle with balanced diet and regular exercise.';
    } else if (bmi >= normalLimit && bmi < 30) {
        border = '13px solid #fbbf24';
        statusText = 'Overweight';
        statusColor = '#fbbf24';
        advice = 'Consider a balanced diet and increase physical activity to reach a healthier weight.';
    } else {
        border = '13px solid red';
        statusText = 'Obese';
        statusColor = 'red';
        advice = 'Please consult with a healthcare professional for a personalized weight management plan.';
    }

    speedmeter.style.borderTop = border;
    speedmeter.style.borderLeft = border;

    statusBtn.innerText = statusText;
    statusBtn.style.background = statusColor;
    statusBtn.style.color = (statusColor === 'yellowgreen' || statusColor === '#fbbf24') ? '#000' : '#fff';

    adviceText.innerText = advice;

    // Save to history
    saveToHistory(gender, bmi.toFixed(2), statusText, height, weight);
}

// Male Run button
maleRun.addEventListener('click', () => {
    calculateBMI('Male', heightMale.value, weightMale.value);
});

// Female Run button
femaleRun.addEventListener('click', () => {
    calculateBMI('Female', heightFemale.value, weightFemale.value);
});

// History Management
function saveToHistory(gender, bmi, status, height, weight) {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    const entry = {
        gender: gender,
        bmi: bmi,
        status: status,
        height: height,
        weight: weight,
        date: dateStr
    };

    history.unshift(entry);

    // Keep only last 20 entries
    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem('bmiHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    const historyList = document.getElementById('history-list');

    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">No history yet. Calculate your BMI to start tracking!</p>';
        return;
    }

    historyList.innerHTML = history.map((entry, index) => `
        <div class="history-item">
            <div>
                <strong>${entry.gender}</strong> - BMI: <strong>${entry.bmi}</strong> (${entry.status}) | 
                Height: ${entry.height}cm, Weight: ${entry.weight}kg | 
                <small>${entry.date}</small>
            </div>
            <button class="delete-btn" onclick="deleteHistoryItem(${index})">Delete</button>
        </div>
    `).join('');
}

function deleteHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('bmiHistory', JSON.stringify(history));
    loadHistory();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('bmiHistory');
        loadHistory();
    }
}