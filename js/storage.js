let editingTaskId = null;
let editingPinnedId = null;
let selectedDate = toISODate(new Date());
let currentDate = new Date();
let weeksToShow = 2; // ← по умолчанию 2 недели

const savedPinned = localStorage.getItem("weeklyPinnedTasks");

const weeklyPinnedTasks = savedPinned
  ? JSON.parse(savedPinned)
  : [
      {
        id: 1,
        icon: "🔔",
        title: "Call doctor for tests",
        date: getDateOffset(0),
        tag: "Personal",
        description: "Ask for blood tests and GYM certificate.",
      },
      {
        id: 2,
        icon: "🎂",
        title: "Masmas's bday",
        date: getDateOffset(0),
        tag: "",
        description: "",
      },
      {
        id: 3,
        icon: "💼",
        title: "Finish project report",
        date: getDateOffset(0),
        tag: "Work",
        description: "Send to manager before 5 PM.",
      },
    ];

// Пытаемся загрузить сохранённые задачи
const savedTasks = localStorage.getItem("scheduleTasks");
// Если есть — используем, иначе — начальные данные

const scheduleTasks = savedTasks
  ? JSON.parse(savedTasks)
  : [
      {
        id: 1,
        icon: "🔔",
        title: "Wake up Buddy",
        time: "07:00",
        date: getDateOffset(0),
        description: "",
        done: true,
      },
      {
        id: 2,
        icon: "🔔",
        title: "Morning Yoga",
        time: "08:00",
        date: getDateOffset(0),
        description: "",
        done: true,
      },
      {
        id: 3,
        icon: "💼",
        title: "Daily workout",
        time: "09:00",
        date: getDateOffset(0),
        description: "* Squat 10x3\n* Push up 10x3\n* Push up 10x3",
      },
      {
        id: 4,
        icon: "💼",
        title: "Shift project kick off pt.1",
        time: "10:00 11:30",
        date: getDateOffset(0),
        description: "Zoom call, kick off with Elena and Jordan from Shift.",
      },
      {
        id: 5,
        icon: "💼",
        title: "Skype Sushi",
        time: "12:30",
        date: getDateOffset(0),
        description: "Lunch with Ally, fight this quarabtine with humor!",
      },
      {
        id: 6,
        icon: "💼",
        title: "Dribbble Shot",
        time: "02:00",
        date: getDateOffset(0),
        description: "Working on a new shot !!",
        done: true,
      },
    ];

function saveTasks() {
  try {
    localStorage.setItem("scheduleTasks", JSON.stringify(scheduleTasks));
  } catch (e) {
    console.warn("Не удалось сохранить задачи:", e);
  }
}

function savePinnedTasks() {
  localStorage.setItem("weeklyPinnedTasks", JSON.stringify(weeklyPinnedTasks));
}
