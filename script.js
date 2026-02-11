const ADMIN_PASSWORD = "loyal";

function getParams() {
  const params = {};
  const raw = window.location.search.substring(1);
  if (!raw) return params;
  raw.split("&").forEach(p => {
    const [k, v] = p.split("=");
    params[k] = decodeURIComponent(v || "");
  });
  return params;
}

function clearLockdownParams() {
  const url = new URL(window.location.href);
  ["lockdown", "end", "msg"].forEach(k => url.searchParams.delete(k));
  window.history.replaceState({}, "", url.toString());
}

const overlay = document.getElementById("lockdown-overlay");
const msgEl = document.getElementById("lockdown-message");
const timerEl = document.getElementById("lockdown-timer");

const adminBtn = document.getElementById("lockdown-admin-button");
const popup = document.getElementById("lockdown-admin-popup");
const passInput = document.getElementById("lockdown-admin-password");
const cancelBtn = document.getElementById("lockdown-admin-cancel");
const submitBtn = document.getElementById("lockdown-admin-submit");
const errorEl = document.getElementById("lockdown-admin-error");

let interval = null;

function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

function showLock(msg, end) {
  msgEl.textContent = msg;
  overlay.classList.remove("lockdown-hidden");
  document.body.style.overflow = "hidden";

  if (interval) clearInterval(interval);

  if (end) {
    const tick = () => {
      const now = Date.now();
      const left = end - now;
      if (left <= 0) {
        timerEl.textContent = "00:00:00";
        clearLockdownParams();
        hideLock();
        return;
      }
      timerEl.textContent = fmt(left);
    };
    tick();
    interval = setInterval(tick, 1000);
  }
}

function hideLock() {
  overlay.classList.add("lockdown-hidden");
  document.body.style.overflow = "";
  if (interval) clearInterval(interval);
}

adminBtn.addEventListener("click", () => {
  errorEl.textContent = "";
  passInput.value = "";
  popup.classList.remove("lockdown-popup-hidden");
  passInput.focus();
});

cancelBtn.addEventListener("click", () => {
  popup.classList.add("lockdown-popup-hidden");
});

submitBtn.addEventListener("click", () => {
  if (passInput.value.trim() === ADMIN_PASSWORD) {
    clearLockdownParams();
    hideLock();
    popup.classList.add("lockdown-popup-hidden");
  } else {
    errorEl.textContent = "Incorrect password.";
  }
});

(function () {
  const p = getParams();
  if (p.lockdown === "1") {
    const msg = p.msg || "This site is locked.";
    const end = p.end ? parseInt(p.end, 10) : null;
    showLock(msg, end);
  }
})();
