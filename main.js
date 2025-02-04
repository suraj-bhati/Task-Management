document.addEventListener('DOMContentLoaded', () => {
    const profileModal = document.getElementById('profileModal');
    const mainPage = document.getElementById('mainPage');
    const profileForm = document.getElementById('profileForm');
    const calendarBody = document.getElementById('calendarBody');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const selectedDateDisplay = document.getElementById('selectedDate');
    const deselectDateButton = document.getElementById('deselectDateButton');
    const timeSlotsContainer = document.querySelector('.time-slots');

    const pomodoroTimeDisplay = document.getElementById('pomodoroTime');
    const startPomodoroButton = document.getElementById('startPomodoro');
    const editPomodoroButton = document.getElementById('editPomodoro');

    const todoList = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');
    const addTodoButton = document.getElementById('addTodoButton');

    const habitsContainer = document.getElementById('habitsContainer');
    const newHabitInput = document.getElementById('newHabitInput');
    const addHabitButton = document.getElementById('addHabitButton');

    let currentDate = new Date();
    let scheduleData = {}; 

    
    // Object to store schedule data for each date
    let selectedDate = null; // Track the selected date
    let pomodoroInterval;
    let remainingTime = 20 * 60; // Default 20 minutes in seconds

    // Handle profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const profileName = document.getElementById('profileName').value;

        if (profileName.trim()) {
            profileModal.style.display = 'none';
            mainPage.classList.remove('hidden');
            renderCalendar();
        } else {
            alert('Please enter a valid name!');
        }
    });

    // Generate calendar
    function renderCalendar() {
        calendarBody.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        let day = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    cell.textContent = '';
                } else if (day > daysInMonth) {
                    break;
                } else {
                    cell.textContent = day;
                    cell.addEventListener('click', () => selectDate(day));
                    day++;
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    // Select a date
    function selectDate(day) {
        if (selectedDate) {
            alert('Finish editing the current day before selecting another.');
            return;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const fullDate = `${month} ${day}, ${year}`;
        selectedDate = fullDate;

        selectedDateDisplay.textContent = `Selected Day: ${fullDate}`;

        if (!scheduleData[fullDate]) {
            scheduleData[fullDate] = Array(18).fill(null); // Initialize empty schedule for the date
        }

        generateTimeSlots(fullDate);
    }

    // Deselect the date
    deselectDateButton.addEventListener('click', () => {
        selectedDate = null;
        selectedDateDisplay.textContent = 'No Day Selected';
        timeSlotsContainer.innerHTML = '';
    });

    // Generate time slots
    function generateTimeSlots(fullDate) {
        timeSlotsContainer.innerHTML = '';
        scheduleData[fullDate].forEach((task, index) => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.innerHTML = `
                <span class="time">${index}:00</span>
                <div class="tasks">
                    <button class="add-task">${task ? task : '+ Add Task'}</button>
                </div>
            `;

            const addButton = timeSlot.querySelector('.add-task');
            addButton.addEventListener('click', () => {
                const newTask = prompt('Enter task for this time slot:', task || '');
                if (newTask) {
                    scheduleData[fullDate][index] = newTask;
                    generateTimeSlots(fullDate);
                }
            });

            timeSlotsContainer.appendChild(timeSlot);
        });
    }

    // Navigate months
    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Update and start Pomodoro timer
    function updatePomodoroDisplay() {
        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        const seconds = (remainingTime % 60).toString().padStart(2, '0');
        pomodoroTimeDisplay.textContent = `${minutes}:${seconds}`;
    }

    function startPomodoro() {
        if (pomodoroInterval) return;

        pomodoroInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updatePomodoroDisplay();
            } else {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
                alert('Pomodoro session complete!');
            }
        }, 1000);
    }

    function editPomodoroTime() {
        const newTime = parseInt(prompt('Enter Pomodoro time in minutes:', remainingTime / 60), 10);
        if (!isNaN(newTime) && newTime > 0) {
            remainingTime = newTime * 60;
            updatePomodoroDisplay();
        }
    }

    startPomodoroButton.addEventListener('click', startPomodoro);
    editPomodoroButton.addEventListener('click', editPomodoroTime);

    // Todo List Functionality
    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const listItem = document.createElement('li');
            listItem.textContent = todoText;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-todo');
            removeButton.addEventListener('click', () => {
                todoList.removeChild(listItem);
            });

            listItem.appendChild(removeButton);
            todoList.appendChild(listItem);

            todoInput.value = '';
        }
    }

    addTodoButton.addEventListener('click', addTodoItem);

    // Add Habit Functionality
    function addHabit() {
        const habitText = newHabitInput.value.trim();
        if (habitText) {
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            habitItem.innerHTML = `
                <span>${habitText}</span>
                <button>Complete</button>
            `;
            habitsContainer.appendChild(habitItem);
            newHabitInput.value = '';
        }
    }

    addHabitButton.addEventListener('click', addHabit);

    // Initialize calendar and Pomodoro display
    renderCalendar();
    updatePomodoroDisplay();
});

// Habit Section - Change background color on completion
document.getElementById('habitsContainer').addEventListener('click', (event) => {
    if (event.target.classList.contains('habit-complete')) {
        const habitItem = event.target.closest('.habit-item');
        if (habitItem) {
            habitItem.style.backgroundColor = '#4CAF50'; // Green color for completed habit
            event.target.disabled = true; // Disable button after completion
        }
    }
});

// Confetti Animation for Habit Completion
const duration = 25 * 500,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function triggerConfetti() {
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

// Attach event listener to Habit Completion buttons
document.getElementById('habitsContainer').addEventListener('click', (event) => {
  if (event.target.classList.contains('habit-complete')) {
    const habitItem = event.target.closest('.habit-item');
    if (habitItem) {
      habitItem.style.backgroundColor = '#4CAF50'; // Mark habit as completed
      event.target.disabled = true; // Disable button after completion
      triggerConfetti(); // Trigger confetti animation
    }
  }
});
