// Функция отрисовывает все карточки в контейнере
function renderScheduleTasks() {
  const list = document.getElementById("scheduleCardList");
  list.innerHTML = "";

  const dayTasks = scheduleTasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time || "")); // ← сортировка по времени

  dayTasks.forEach((task) => {
    const card = createScheduleCard(task);
    list.appendChild(card);
  });

  if (dayTasks.length === 0) {
    list.innerHTML =
      '<p class="schedule-card__empty">На данный день список задач пуст</p>';
    return;
  }
}

// Функция создаёт карточку из данных
function createScheduleCard(task) {
  // 1. Клонируем шаблон
  const template = document.getElementById("scheduleCardTemplate");
  const card = template.content.cloneNode(true); // true = глубокая копия

  // 2. Заполняем данными
  card.querySelector(".schedule-card__title").textContent = task.title;
  card.querySelector(".schedule-card__time").textContent = task.time;
  card.querySelector(".schedule-card__description").textContent =
    task.description;

  // Если задача выполнена — добавляем модификатор
  if (task.done) {
    card.querySelector(".schedule-card").classList.add("schedule-card--done");
  }
  //  Скрываем пустые поля (если tag или description пустые)
  if (!task.description) {
    card.querySelector(".schedule-card__description").style.display = "none";
  }

  // ← КЛИК НА КАРТОЧКУ — РЕДАКТИРОВАНИЕ
  card.querySelector(".schedule-card").addEventListener("click", () => {
    openEditModal(task.id);
  });

  // ← КНОПКА УДАЛЕНИЯ
  const deleteBtn = card.querySelector(".schedule-card__delete");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // ← чтобы клик не сработал на карточке
    deleteScheduleTask(task.id);
  });

  // Чекбокс "выполнено"
  const checkbox = card.querySelector(".schedule-card__checkbox");
  checkbox.addEventListener("click", (e) => {
    e.stopPropagation(); // ← чтобы не сработало редактирование
    toggleTaskDone(task.id);
  });

  //  Возвращаем готовую карточку
  return card;
}

function toggleTaskDone(id) {
  const task = scheduleTasks.find((t) => t.id === id);
  if (!task) return;

  task.done = !task.done; // ← переключаем
  saveTasks();
  renderScheduleTasks();
}

function deleteScheduleTask(id) {
  // 1. Находим индекс задачи в массиве
  const index = scheduleTasks.findIndex((task) => task.id === id);

  // 2. Если не нашли — выходим
  if (index === -1) return;

  // 3. Удаляем из массива
  scheduleTasks.splice(index, 1);

  // 4. Сохраняем в localStorage
  saveTasks();

  // 5. Перерисовываем
  renderScheduleTasks();
}

function openEditModal(taskId) {
  // 1. Находим задачу в массиве
  const task = scheduleTasks.find((t) => t.id === taskId);
  if (!task) return;

  // 2. Запоминаем id — потом поймём, что это редактирование
  editingTaskId = taskId;

  // 3. Заполняем поля формы данными задачи
  const form = document.getElementById("scheduleForm");
  form.querySelector('[name="title"]').value = task.title;
  form.querySelector('[name="date"]').value = task.date;
  form.querySelector('[name="time"]').value = task.time;
  form.querySelector('[name="description"]').value = task.description;

  // 4. Меняем заголовок модалки (опционально)
  scheduleModal.querySelector("h2").textContent = "Edit task";
  scheduleModal.querySelector('[type="submit"]').textContent = "Save";
  // 5. Открываем модалку
  scheduleModal.classList.add("modal--open");
}

function resetScheduleModal() {
  editingTaskId = null;
  scheduleForm.reset();
  scheduleModal.querySelector("h2").textContent = "New task";
  scheduleModal.querySelector('[type="submit"]').textContent = "Add";
}

const scheduleModal = document.getElementById("scheduleModal");
const scheduleOpenBtn = document.querySelector(".schedule-header__add");
const scheduleCancelBtn = scheduleModal.querySelector(".modal__cancel");
const scheduleOverlay = scheduleModal.querySelector(".modal__overlay");

//Обработка формы обычной задачи
const scheduleForm = document.getElementById("scheduleForm");
scheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(scheduleForm);

  const title = formData.get("title").trim();
  const time = formData.get("time");
  const description = formData.get("description").trim();
  const date = formData.get("date");

  // Валидация
  if (!title || !time || !date) {
    alert("Заполните название, дату и время!");
    return;
  }

  if (editingTaskId !== null) {
    // ============ РЕЖИМ РЕДАКТИРОВАНИЯ ============
    // 1. Находим задачу
    const task = scheduleTasks.find((t) => t.id === editingTaskId);
    if (!task) return;

    // 2. Обновляем поля
    task.title = title;
    task.time = time;
    task.date = date;
    task.description = description;

    // 3. Сбрасываем editingTaskId
    editingTaskId = null;
  } else {
    // ============ РЕЖИМ СОЗДАНИЯ ============
    const newTask = {
      id: Date.now(),
      icon: "📌",
      title: title,
      time: time,
      date: date,
      description: description,
      done: false,
    };

    scheduleTasks.push(newTask);
  }

  // Общие действия для обоих режимов
  saveTasks();
  renderScheduleTasks();
  scheduleForm.reset();
  scheduleModal.classList.remove("modal--open");

  // Возвращаем заголовок модалки
  scheduleModal.querySelector("h2").textContent = "Новая задача";
});

scheduleOpenBtn.addEventListener("click", () => {
  resetScheduleModal();
  scheduleModal.classList.add("modal--open");
});

scheduleCancelBtn.addEventListener("click", () => {
  scheduleModal.classList.remove("modal--open");
  resetScheduleModal();
});

scheduleOverlay.addEventListener("click", () => {
  scheduleModal.classList.remove("modal--open");
  resetScheduleModal();
});
