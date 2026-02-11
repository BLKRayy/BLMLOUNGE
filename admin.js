const ADMIN_PASSWORD = "loyal";

const adminContent = document.getElementById("admin-content");
const loginBox = document.querySelector(".admin-login-box");
const loginBtn = document.getElementById("admin-login-btn");
const passInput = document.getElementById("admin-password");
const errorEl = document.getElementById("admin-error");

loginBtn.addEventListener("click", () => {
  if (passInput.value.trim() === ADMIN_PASSWORD) {
    loadAdminPanel();
  } else {
    errorEl.textContent = "Incorrect password.";
  }
});

function loadAdminPanel() {
  adminContent.classList.remove("admin-locked");
  adminContent.innerHTML = `
    <h1>Admin Panel</h1>

    <section class="admin-section">
      <h2>Global Lockdown</h2>
      <textarea id="lock-msg" placeholder="Lockdown message"></textarea>
      <input type="number" id="lock-mins" placeholder="Minutes" />
      <button id="activate-lock">Activate Lockdown</button>
    </section>

    <section class="admin-section">
      <h2>Game Manager</h2>
      <button id="add-game">Add Game</button>
      <button id="edit-game">Edit Game</button>
      <button id="delete-game">Delete Game</button>
    </section>

    <section class="admin-section">
      <h2>Theme Settings</h2>
      <button>Light</button>
      <button>Dark</button>
      <button>Neon</button>
    </section>

    <section class="admin-section">
      <h2>System Logs</h2>
      <div class="log-box">Logs will appear here.</div>
    </section>

    <section class="admin-section">
      <h2>Debug Tools</h2>
      <button onclick="location.reload()">Force Reload</button>
      <button onclick="alert('Cache cleared (simulated).')">Clear Cache</button>
    </section>

    <section class="admin-section">
      <h2>Version Info</h2>
      <p>BLK Launcher v1.0</p>
      <p>Build Date: Feb 2026</p>
    </section>
  `;

  document.getElementById("activate-lock").addEventListener("click", () => {
    const msg = encodeURIComponent(document.getElementById("lock-msg").value);
    const mins = parseInt(document.getElementById("lock-mins").value, 10);
    const end = Date.now() + mins * 60000;

    const url = new URL(window.location.origin + "/index.html");
    url.searchParams.set("lockdown", "1");
    url.searchParams.set("msg", msg);
    url.searchParams.set("end", end);

    window.location.href = url.toString();
  });
}
