// Time/Weather widget
function updateClock() {
  let currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  document.getElementById("weatherTime").textContent = currentTime;
}

function scheduleNextUpdate() {
  updateClock();
  const now = new Date();
  const msToNextMinute =
    60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  setTimeout(scheduleNextUpdate, msToNextMinute);
}
