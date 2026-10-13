// Функция отрисовывает все карточки в контейнере
function renderWeeklyPinned() {
  const list = document.getElementById("weeklyPinnedList");
  list.innerHTML = "";

  // Определяем диапазон текущей недели (недели, в которой selectedDate)
  const week = getWeekRange(selectedDate);

  // Фильтруем: оставляем только задачи, попадающие в этот диапазон
  const weekTasks = weeklyPinnedTasks
    .filter((task) => task.date >= week.start && task.date <= week.end)
    .sort((a, b) => a.date.localeCompare(b.date)); // ← сортировка по дате

  weekTasks.forEach((task) => {
    const card = createPinnedCard(task, false);
    list.appendChild(card);
  });

  if (weekTasks.length === 0) {
    list.innerHTML =
      '<p class="weekly-pinned__empty">Нет закрепленных задач на эту неделю</p>';
    return;
  }
}
// Функция создаёт карточку из данных
function createPinnedCard(task, isLarge = false) {
  // 1. Клонируем шаблон
  const template = document.getElementById("pinnedCardTemplate");
  const card = template.content.cloneNode(true); // true = глубокая копия

  // 2. Заполняем данными
  card.querySelector(".pinned-card__icon").textContent = task.icon;
  card.querySelector(".pinned-card__title").textContent = task.title;
  card.querySelector(".pinned-card__date").textContent = task.date;
  card.querySelector(".pinned-card__tag").textContent = task.tag;
  card.querySelector(".pinned-card__description").textContent =
    task.description;

  // 3. Скрываем пустые поля (если tag или description пустые)
  if (!task.tag) {
    card.querySelector(".pinned-card__tag").style.display = "none";
  }
  if (!task.description) {
    card.querySelector(".pinned-card__description").style.display = "none";
  }
  if (isLarge) {
    card.querySelector(".pinned-card").classList.add("pinned-card--large");
  }
  // ← КЛИК НА КАРТОЧКУ — РЕДАКТИРОВАНИЕ
  card.querySelector(".pinned-card").addEventListener("click", () => {
    openEditPinnedModal(task.id);
  });

  // ← КНОПКА УДАЛЕНИЯ
  const deleteBtn = card.querySelector(".pinned-card__delete");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // ← чтобы клик не сработал на карточке
    deletePinnedTask(task.id);
  });

  // 4. Возвращаем готовую карточку
  return card;
}

function renderAllPinned() {
  const list = document.getElementById("allPinnedList");
  list.innerHTML = "";

  const sortedTasks = [...weeklyPinnedTasks].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  sortedTasks.forEach((task) => {
    const card = createPinnedCard(task, true);
    list.appendChild(card);
  });
}

function deletePinnedTask(id) {
  const index = weeklyPinnedTasks.findIndex((task) => task.id === id);
  if (index === -1) return;

  weeklyPinnedTasks.splice(index, 1);
  savePinnedTasks();
  renderWeeklyPinned();
}

//Редактирование
function openEditPinnedModal(taskId) {
  // 1. Находим задачу в массиве
  const task = weeklyPinnedTasks.find((t) => t.id === taskId);
  if (!task) return;

  // 2. Запоминаем id — потом поймём, что это редактирование
  editingPinnedId = taskId;

  // 3. Заполняем поля формы данными задачи
  const form = document.getElementById("pinnedForm");
  form.querySelector('[name="title"]').value = task.title;
  form.querySelector('[name="date"]').value = task.date;
  form.querySelector('[name="tag"]').value = task.tag;
  form.querySelector('[name="description"]').value = task.description;
  form.querySelector('[name="icon"]').value = task.icon || "📌";

  // Подсвечиваем нужный эмодзи
  const emojiPicker = document.getElementById("emojiPicker");
  emojiPicker.querySelectorAll(".emoji-picker__item").forEach((el) => {
    el.classList.toggle("active", el.dataset.emoji === (task.icon || "📌"));
  });

  // 4. Меняем заголовок модалки (опционально)
  pinnedModal.querySelector("h2").textContent = "Редактировать задачу";
  pinnedModal.querySelector('[type="submit"]').textContent = "Сохранить";
  // 5. Открываем модалку
  pinnedModal.classList.add("modal--open");
}

function resetPinnedModal() {
  editingPinnedId = null;
  pinnedForm.reset();
  selectedIconInput.value = "📌"; // ← сбрасываем
  emojiPicker.querySelectorAll(".emoji-picker__item").forEach((el) => {
    el.classList.toggle("active", el.dataset.emoji === "📌");
  });
  pinnedModal.querySelector("h2").textContent = "New task";
  pinnedModal.querySelector('[type="submit"]').textContent = "Add";
}

const pinnedModal = document.getElementById("pinnedModal");
const pinnedOpenBtn = document.querySelector(".weekly-pinned__add");
const pinnedCancelBtn = pinnedModal.querySelector(".modal__cancel");
const pinnedOverlay = pinnedModal.querySelector(".modal__overlay");

const pinnedForm = document.getElementById("pinnedForm");

//Открытие модалки для всех Weekly Pinned
const allPinnedModal = document.getElementById("allPinnedModal");
const viewAllBtn = document.querySelector(".weekly-pinned__link");
const closeAllPinnedBtn = document.getElementById("closeAllPinned");
const allPinnedOverlay = allPinnedModal.querySelector(".modal__overlay");

// ============================================
// ВЫБОР ЭМОДЗИ В ФОРМЕ PINNED
// ============================================
const emojiPicker = document.getElementById("emojiPicker");
const selectedIconInput = document.getElementById("selectedIcon");

if (emojiPicker) {
  emojiPicker.addEventListener("click", (e) => {
    const btn = e.target.closest(".emoji-picker__item");
    if (!btn) return;

    const emoji = btn.dataset.emoji;
    selectedIconInput.value = emoji;

    // Подсветка выбранного
    emojiPicker.querySelectorAll(".emoji-picker__item").forEach((el) => {
      el.classList.toggle("active", el === btn);
    });
  });

  // Устанавливаем начальное активное состояние
  const initialEmoji = selectedIconInput.value;
  emojiPicker.querySelectorAll(".emoji-picker__item").forEach((el) => {
    el.classList.toggle("active", el.dataset.emoji === initialEmoji);
  });
}

//Обработчики
pinnedOpenBtn.addEventListener("click", () => {
  resetPinnedModal();
  pinnedModal.classList.add("modal--open");
});

pinnedCancelBtn.addEventListener("click", () => {
  pinnedModal.classList.remove("modal--open");
  resetPinnedModal();
});

pinnedOverlay.addEventListener("click", () => {
  pinnedModal.classList.remove("modal--open");
  resetPinnedModal();
});

pinnedForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(pinnedForm);

  const title = formData.get("title").trim();
  const date = formData.get("date");
  const tag = formData.get("tag").trim();
  const description = formData.get("description").trim();
  const icon = formData.get("icon") || "📌";

  if (!title || !date) {
    alert("Fill in the title and date area!");
    return;
  }

  // Форматируем дату
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (editingPinnedId !== null) {
    // ============ РЕЖИМ РЕДАКТИРОВАНИЯ ============
    const task = weeklyPinnedTasks.find((t) => t.id === editingPinnedId);
    if (!task) return;

    const icon = formData.get("icon") || "📌"; // ← считываем эмодзи
    // Обновляем поля существующей задачи
    task.title = title;
    task.time = formattedDate;
    task.date = date;
    task.tag = tag;
    task.description = description;
    task.icon = icon;

    // Сбрасываем режим редактирования
    editingPinnedId = null;
  } else {
    // ============ РЕЖИМ СОЗДАНИЯ ============
    const newTask = {
      id: Date.now(),
      icon: icon,
      title: title,
      time: formattedDate,
      date: date, // ← сохраняем и машинный формат
      tag: tag,
      description: description,
    };

    weeklyPinnedTasks.push(newTask);
  }

  savePinnedTasks();
  renderWeeklyPinned();
  pinnedForm.reset();
  pinnedModal.classList.remove("modal--open");
  pinnedModal.querySelector("h2").textContent = "Новая задача";
  pinnedModal.querySelector('[type="submit"]').textContent = "Добавить";
});

viewAllBtn.addEventListener("click", (e) => {
  e.preventDefault(); // ← отменяем переход по ссылке
  renderAllPinned();
  allPinnedModal.classList.add("modal--open");
});

closeAllPinnedBtn.addEventListener("click", () => {
  allPinnedModal.classList.remove("modal--open");
});

allPinnedOverlay.addEventListener("click", () => {
  allPinnedModal.classList.remove("modal--open");
});
