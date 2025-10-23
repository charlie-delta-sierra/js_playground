const TIME_OPTIONS = [1, 3, 5, 10, 15, 30];
const CIRCLE_RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const timeDisplay = document.getElementById('time-display');
const timerProgress = document.getElementById('timer-progress');
const timeOptionsContainer = document.getElementById('time-options');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const messageBox = document.getElementById('message-box');

let totalTimeSeconds = TIME_OPTIONS[0] * 60;
let timeLeftSeconds = totalTimeSeconds;
let isRunning = false;
let timerInterval = null;
let volume = 0.5;
let soundEnabled = false;
let messageEnabled = false;

const menuBtn = document.getElementById('menu-btn');
const menuPanel = document.getElementById('menu-panel');
const messageBtn = document.getElementById('message-btn');
const soundBtn = document.getElementById('sound-btn');
const soundIcon = document.getElementById('sound-icon');
const volumeSlider = document.getElementById('volume-slider');
const customTimesGrid = document.getElementById('custom-times-grid');
const customTimeInputs = customTimesGrid.querySelectorAll('.custom-time-input');

timerProgress.style.strokeDasharray = CIRCUMFERENCE;
timerProgress.style.strokeDashoffset = 0;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const updateProgress = () => {
    const percentage = timeLeftSeconds / totalTimeSeconds;
    // -- For counter-clockwise, offset increases as time passes
    const offset = CIRCUMFERENCE * (1 - percentage);
    // -- For clockwise rotation. it inverts the foreground, background colors
    // const offset = CIRCUMFERENCE * percentage;
    timerProgress.style.strokeDashoffset = offset;
};

const updateDisplay = () => {
    timeDisplay.textContent = formatTime(timeLeftSeconds);
    updateProgress();
};

const showMessage = (text, type = 'blue') => {
    if (!messageEnabled) return;
    messageBox.textContent = text;
    messageBox.className = `mt-4 p-3 border rounded-lg text-sm`;
    if (type === 'blue') {
        messageBox.classList.add('bg-blue-100', 'border-blue-300', 'text-blue-700');
    } else if (type === 'green') {
        messageBox.classList.add('bg-green-100', 'border-green-300', 'text-green-700');
    }
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        if (messageEnabled) messageBox.classList.add('hidden');
    }, 3000);
};

function beep() {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        ctx.close();
    }, 200);
}

const countdown = () => {
    if (!isRunning) return;
    timeLeftSeconds--;
    updateDisplay();
    if (timeLeftSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
        startBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        showMessage('Time is up! Countdown finished.', 'green');
    }
};

const handleStartStop = () => {
    console.log(`run button clicked`)
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        startBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        showMessage("Timer stopped.", 'blue');
    } else {
        isRunning = true;
        startBtn.textContent = 'Stop';
        startBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        startBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        timerInterval = setInterval(() => {
            timeLeftSeconds--;
            if (timeLeftSeconds <= 0) {
                timeLeftSeconds = totalTimeSeconds;
                beep();
                showMessage('Time is up! Restarting countdown.', 'green');
            }
            updateDisplay();
        }, 1000);
    }
};

const handleReset = () => {
    clearInterval(timerInterval);
    isRunning = false;
    const selectedRadio = document.querySelector('input[name="time-preset"]:checked');
    const minutes = selectedRadio ? parseInt(selectedRadio.value) : TIME_OPTIONS[0];
    totalTimeSeconds = minutes * 60;
    timeLeftSeconds = totalTimeSeconds;
    updateDisplay();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
    startBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    showMessage("Timer reset to " + formatTime(totalTimeSeconds) + ".", 'blue');
};

const createRadioOptions = () => {
    TIME_OPTIONS.forEach((minutes, index) => {
        const isChecked = index === 0;
        const label = document.createElement('label');
        label.className = "flex items-center justify-center p-2 rounded-lg cursor-pointer transition duration-150 ease-in-out shadow-inner bg-gray-50 hover:bg-gray-200 text-sm font-medium text-gray-700";
        if (isChecked) label.classList.add('label-selected');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'time-preset';
        input.value = minutes;
        input.className = 'hidden';
        input.checked = isChecked;
        const span = document.createElement('span');
        span.textContent = `${minutes} min`;
        input.addEventListener('change', handleTimeChange);
        label.appendChild(input);
        label.appendChild(span);
        timeOptionsContainer.appendChild(label);
    });
};

const handleTimeChange = (event) => {
    if (isRunning) {
        showMessage("Please pause or reset the timer before changing the duration.", 'blue');
        document.querySelectorAll('#time-options label').forEach(label => {
            label.classList.remove('label-selected');
        });
        const checkedRadio = document.querySelector('input[name="time-preset"]:checked');
        if (checkedRadio) checkedRadio.parentElement.classList.add('label-selected');
        return;
    }
    const newMinutes = parseInt(event.target.value);
    totalTimeSeconds = newMinutes * 60;
    timeLeftSeconds = totalTimeSeconds;
    updateDisplay();
    document.querySelectorAll('#time-options label').forEach(label => {
        label.classList.remove('label-selected');
    });
    event.target.parentElement.classList.add('label-selected');
};

menuBtn.addEventListener('click', () => {
    menuPanel.classList.toggle('hidden');
});

document.addEventListener('mousedown', (e) => {
    if (!menuBtn.contains(e.target) && !menuPanel.contains(e.target)) {
        menuPanel.classList.add('hidden');
    }
});

const setSoundInterface = () => {
    soundIcon.innerHTML = soundEnabled
        ? `<path d="M9 9v6h4l5 5V4l-5 5H9z" />`
        : `<path d="M9 9v6h4l5 5V4l-5 5H9z"/><line x1="20" y1="4" x2="4" y2="20" stroke="red" stroke-width="2"/>`;
};

const setMessageInterface = () => {
    messageBtn.innerHTML = messageEnabled
        ? `<span>Messages</span>`
        : `<span>Messages</span><span id="messages-line" class="absolute top-1/2 left-1/2 w-1/4 h-1 bg-red-500 transform -rotate-45 origin-center -translate-y-1/2 -translate-x-1/2"></span>`;
};

soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled ? '1' : '0');
    setSoundInterface();
    if (soundEnabled) {
        soundBtn.classList.remove('bg-red-200', 'hover:bg-red-300');
        soundBtn.classList.add('bg-blue-200', 'hover:bg-blue-300');
    } else {
        soundBtn.classList.add('bg-red-200', 'hover:bg-red-300');
        soundBtn.classList.remove('bg-blue-200', 'hover:bg-blue-300');
    }
});

messageBtn.addEventListener('click', (e) => {
    messageEnabled = !messageEnabled;
    localStorage.setItem('messageEnabled', messageEnabled ? '1' : '0');
    setMessageInterface();
    if (messageEnabled) {
        messageBtn.classList.remove('bg-red-200', 'hover:bg-red-300');
        messageBtn.classList.add('bg-blue-200', 'hover:bg-blue-300');
        messageBox.classList.remove('hidden');
    } else {
        messageBtn.classList.add('bg-red-200', 'hover:bg-red-300');
        messageBtn.classList.remove('bg-blue-200', 'hover:bg-blue-300');
        messageBox.classList.add('hidden');
    }
});

volumeSlider.addEventListener('input', (e) => {
    volume = parseFloat(e.target.value);
    localStorage.setItem('volume', volume);
});

customTimeInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            menuPanel.classList.add('hidden');
        }
    });
});

function saveCustomTimes() {
    const values = Array.from(customTimeInputs)
        .map(input => input.value.trim())
        .filter(v => v !== '')
        .map(v => parseInt(v, 10))
        .filter(v => !isNaN(v) && v > 0);

    if (values.length === 0 || values.length > 6) {
        showMessage('Please enter up to 6 positive numbers.', 'blue');
        return;
    }
    TIME_OPTIONS.length = 0;
    values.forEach(v => TIME_OPTIONS.push(v));
    localStorage.setItem('customTimes', values.join(','));
    handleReset();
    timeOptionsContainer.innerHTML = '';
    createRadioOptions();
}

customTimeInputs.forEach(input => {
    input.addEventListener('blur', saveCustomTimes);
});

startBtn.addEventListener('click', handleStartStop);
resetBtn.addEventListener('click', handleReset);



// Load settings from localStorage
window.onload = () => {
    // Messages
    messageEnabled = localStorage.getItem('messageEnabled') === '1';
    setMessageInterface();

    // Sound
    soundEnabled = localStorage.getItem('soundEnabled') === '1';
    setSoundInterface();

    // Volume
    volume = parseFloat(localStorage.getItem('volume')) || 0.5;
    volumeSlider.value = volume;

    // Custom times
    const savedTimes = localStorage.getItem('customTimes');
    if (savedTimes) {
        const values = savedTimes.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
        customTimeInputs.forEach((input, idx) => {
            input.value = values[idx] !== undefined ? values[idx] : '';
            console.log(`input values: ${input.value}`)
        });
        if (values.length > 0 && values.length <= 6) {
            TIME_OPTIONS.length = 0;
            values.forEach(v => TIME_OPTIONS.push(v));
        }
    } else {
        customTimeInputs.forEach((input, idx) => {
            input.value = TIME_OPTIONS[idx] || '';
        });
    }
    createRadioOptions();
    updateDisplay();
    startBtn.textContent = 'Start';
};