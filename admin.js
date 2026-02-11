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

passInput.addEventListener("keydown", e => {
  if (e.key === "Enter") loginBtn.click();
});

function buildIndexUrlFromAdmin() {
  const url = new URL(window.location.href);
  // Replace /admin.html with /index.html, keep repo path
  url.pathname = url.pathname.replace(/admin\.html$/, "index.html");
  url.search = "";
  return url;
}

function loadAdminPanel() {
  adminContent.classList.remove("admin-locked");
  adminContent.innerHTML = `
    <h1>Admin Panel</h1>

    <section class="admin-section">
      <h2>Global Lockdown</h2>
      <textarea id="lock-msg" placeholder="Lockdown message"></textarea>
      <input type="number" id="lock-mins" placeholder="Minutes" min="1" value="60" />
      <button id="activate-lock">Activate Lockdown</button>
      <p class="hint">This will send users to index.html with ?lockdown=1&end=...&msg=...</p>
    </section>

    <section class="admin-section">
      <h2>Game Manager</h2>
      <button id="add-game">Add Game (placeholder)</button>
      <button id="edit-game">Edit Game (placeholder)</button>
      <button id="delete-game">Delete Game (placeholder)</button>
    </section>

    <section class="admin-section">
      <h2>Theme Settings</h2>
      <button class="theme-btn" data-theme="light">Light</button>
      <button class="theme-btn" data-theme="dark">Dark</button>
      <button class="theme-btn" data-theme="neon">Neon</button>
    </section>

    <section class="admin-section">
      <h2>System Logs</h2>
      <div id="log-box" class="log-box"></div>
    </section>

    <section class="admin-section">
      <h2>Debug Tools</h2>
      <button id="debug-reload">Force Reload</button>
      <button id="debug-reset-admin">Reset Admin Session</button>
    </section>

    <section class="admin-section">
      <h2>Version Info</h2>
      <p>BLK Launcher v1.0</p>
      <p>Build Date: Feb 2026</p>
    </section>
  `;

  const logBox = document.getElementById("log-box");
  const log = msg => {
    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logBox.prepend(line);
  };

  document.getElementById("activate-lock").addEventListener("click", () => {
    const msg = encodeURIComponent(
      document.getElementById("lock-msg").value.trim() || "This site is locked."
    );
    const mins = parseInt(document.getElementById("lock-mins").value, 10) || 60;
    const end = Date.now() + mins * 60000;

    const indexUrl = buildIndexUrlFromAdmin();
    indexUrl.searchParams.set("lockdown", "1");
    indexUrl.searchParams.set("msg", msg);
    indexUrl.searchParams.set("end", String(end));

    log("Lockdown activated.");
    window.location.href = indexUrl.toString();
  });

  document.getElementById("add-game").addEventListener("click", () => {
    log("Add game clicked (placeholder).");
    alert("Game manager is a placeholder in this build.");
  });
  document.getElementById("edit-game").addEventListener("click", () => {
    log("Edit game clicked (placeholder).");
    alert("Game manager is a placeholder in this build.");
  });
  document.getElementById("delete-game").addEventListener("click", () => {
    log("Delete game clicked (placeholder).");
    alert("Game manager is a placeholder in this build.");
  });

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      log(`Theme changed to ${theme} (simulated).`);
      alert(`Theme set to ${theme} (simulated).`);
    });
  });

  document.getElementById("debug-reload").addEventListener("click", () => {
    log("Force reload triggered.");
    location.reload();
  });

  document.getElementById("debug-reset-admin").addEventListener("click", () => {
    log("Admin session reset (reload required).");
    alert("Admin session reset. Reloading.");
    location.reload();
  });

  log("Admin logged in.");
}
