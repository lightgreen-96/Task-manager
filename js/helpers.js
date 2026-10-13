// Превращает Date в строку "2026-09-22"
function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

// Возвращает { start, end } — понедельник и воскресенье недели,
// в которой находится переданная дата (строка "YYYY-MM-DD")
function getWeekRange(dateString) {
  const date = new Date(dateString);

  // 1. Находим понедельник этой недели
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - offsetToMonday);

  // 2. Воскресенье = понедельник + 6 дней
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: toISODate(monday),
    end: toISODate(sunday),
  };
}
