const weeksBtn = document.getElementById("weeksBtn");
const weeksMenu = document.getElementById("weeksMenu");
const weeksLabel = document.getElementById("weeksLabel");

const savedWeeks = localStorage.getItem("weeksToShow");
if (savedWeeks) {
  weeksToShow = Number(savedWeeks);
  weeksLabel.textContent = weeksMenu.querySelector(
    `[data-weeks="${weeksToShow}"]`,
  ).textContent;
  weeksMenu
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("active"));
  weeksMenu
    .querySelector(`[data-weeks="${weeksToShow}"]`)
    .classList.add("active");
}

function renderCalendar() {
  const grid = document.querySelector(".calendar__grid");
  const title = document.getElementById("calendarTitle");

  grid.querySelectorAll(".calendar__day").forEach((el) => el.remove());

  // 1. Находим понедельник текущей недели
  const startDate = new Date(currentDate);
  const dayOfWeek = startDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - offsetToMonday);

  // 2. Заголовок — месяц и год startDate
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  title.textContent = `${monthNames[startDate.getMonth()]}, ${startDate.getFullYear()}`;

  // 3. Сколько дней показать
  const totalDays = weeksToShow * 7;

  // 4. Отрисовываем дни
  const today = new Date();

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayEl = document.createElement("div");
    dayEl.className = "calendar__day";
    dayEl.dataset.date = toISODate(date);

    const numberEl = document.createElement("span");
    numberEl.className = "calendar__day-number";
    numberEl.textContent = date.getDate();
    dayEl.appendChild(numberEl);

    if (hasTasksOnDate(toISODate(date))) {
      const dot = document.createElement("span");
      dot.className = "calendar__dot";
      dayEl.appendChild(dot);
    }

    // ← ПРОВЕРКА: день не из текущего месяца?
    if (date.getMonth() !== currentDate.getMonth()) {
      dayEl.classList.add("calendar__day--other-month");
    }

    if (toISODate(date) === selectedDate) {
      dayEl.classList.add("calendar__day--selected");
    }

    // Подсветка сегодняшнего дня
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      dayEl.classList.add("calendar__day--active");
    }

    grid.appendChild(dayEl);

    // Обработчик клика на дни
    grid.querySelectorAll(".calendar__day").forEach((dayEl) => {
      dayEl.addEventListener("click", () => {
        selectedDate = dayEl.dataset.date; // ← меняем выбранную дату
        renderCalendar(); // ← перерисовываем календарь (для подсветки)
        renderScheduleTasks(); // ← перерисовываем задачи
        renderWeeklyPinned();
        updateHeaderDate(); // ← обновляем заголовок "Thursday 11"
      });
    });
  }
}

function changeDay(offset) {
  // 1. Превращаем строку "2026-09-22" в объект Date
  const dateObj = new Date(selectedDate);

  // 2. Меняем день на offset (например, -1 или +1)
  dateObj.setDate(dateObj.getDate() + offset);

  // 3. Превращаем обратно в строку "2026-09-22"
  selectedDate = toISODate(dateObj);

  // 4. Перерисовываем всё, что зависит от selectedDate
  renderCalendar(); // подсветка выбранного дня
  renderScheduleTasks(); // список задач
  renderWeeklyPinned();
  updateHeaderDate(); // заголовок "Thursday 22"
}

function hasTasksOnDate(dateString) {
  // Проверяем scheduleTasks
  const inSchedule = scheduleTasks.some((task) => task.date === dateString);
  // Проверяем weeklyPinnedTasks
  const inPinned = weeklyPinnedTasks.some((task) => task.date === dateString);

  return inSchedule || inPinned;
}

function updateHeaderDate() {
  const headerDate = document.getElementById("scheduleDate");
  const dateObj = new Date(selectedDate);

  // Формат: "Thursday 11" (день недели + число)
  const formatted = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
  });

  headerDate.textContent = formatted;
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Открытие/закрытие меню
weeksBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = weeksMenu.classList.toggle("open");
  weeksBtn.setAttribute("aria-expanded", isOpen);

  if (isOpen) {
    const rect = weeksBtn.getBoundingClientRect();
    weeksMenu.style.top = `${rect.bottom + 4}px`;
    weeksMenu.style.right = `${window.innerWidth - rect.right}px`; // ← right вместо left
    weeksMenu.style.left = "auto"; // ← сброс left
  }
});

// Выбор опции
weeksMenu.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    const weeks = Number(item.dataset.weeks);
    weeksToShow = weeks;
    localStorage.setItem("weeksToShow", weeks);

    // Обновляем метку на кнопке
    weeksLabel.textContent = item.textContent;

    // Обновляем active-класс
    weeksMenu
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("active"));
    item.classList.add("active");

    // Закрываем меню
    weeksMenu.classList.remove("open");
    weeksBtn.setAttribute("aria-expanded", "false");

    // Перерисовываем календарь
    renderCalendar();
  });
});

// Закрытие по клику вне меню
document.addEventListener("click", (e) => {
  if (!e.target.closest("#weeksDropdown")) {
    weeksMenu.classList.remove("open");
    weeksBtn.setAttribute("aria-expanded", "false");
  }
});

// Закрытие по Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    weeksMenu.classList.remove("open");
    weeksBtn.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("prevDay").addEventListener("click", () => {
  changeDay(-1);
});

document.getElementById("nextDay").addEventListener("click", () => {
  changeDay(1);
});
