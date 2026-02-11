const ADMIN_PASSWORD = "loyal";

// ---- URL helpers ----
function getParams() {
  const params = {};
  const raw = window.location.search.substring(1);
  if (!raw) return params;
  raw.split("&").forEach(p => {
    const [k, v] = p.split("=");
    if (!k) return;
    params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return params;
}

function clearLockdownParams() {
  const clean = window.location.origin + window.location.pathname;
  window.location.replace(clean);
}

// ---- Lockdown elements (may be null on some pages) ----
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

// ---- Timer formatting ----
function fmt(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

// ---- Show lockdown ----
function showLock(msg, end) {
  if (!overlay) return;

  msgEl.textContent = msg || "This site is locked.";
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
        return;
      }
      timerEl.textContent = fmt(left);
    };
    tick();
    interval = setInterval(tick, 1000);
  } else {
    timerEl.textContent = "--:--:--";
  }
}

// ---- Hide lockdown ----
function hideLock() {
  if (!overlay) return;
  overlay.classList.add("lockdown-hidden");
  document.body.style.overflow = "";
  if (interval) clearInterval(interval);
}

// ---- Admin unlock popup ----
if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    errorEl.textContent = "";
    passInput.value = "";
    popup.classList.remove("lockdown-popup-hidden");
    passInput.focus();
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    popup.classList.add("lockdown-popup-hidden");
  });
}

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    if (passInput.value.trim() === ADMIN_PASSWORD) {
      clearLockdownParams();
    } else {
      errorEl.textContent = "Incorrect password.";
    }
  });
}

// ---- INIT ----
(function () {
  const p = getParams();

  // If no lockdown param → ALWAYS show normal homepage
  if (!p.lockdown) {
    hideLock();
    return;
  }

  // If lockdown=1 → activate lockdown
  if (p.lockdown === "1") {
    const msg = p.msg || "This site is locked.";
    const end = p.end ? parseInt(p.end, 10) : null;
    showLock(msg, end);
  }
})();
