const AUTH_STORAGE_KEY = "engineerOSAuth";
const AUTH_API_BASE_URL = "http://localhost:3000/api/auth";

function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function getAuthToken() {
  return getStoredSession()?.token || null;
}

function updateProfileName() {
  const user = getStoredSession()?.user;

  for (const profileName of document.querySelectorAll("[data-profile-name]")) {
    profileName.textContent = user?.name || "Sign in";
  }
}

function showAuthMessage(message, type = "error") {
  const authMessage = document.querySelector("#authMessage");

  if (!authMessage) {
    return;
  }

  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
}

function setAuthMode(mode) {
  const isRegistering = mode === "register";
  const nameField = document.querySelector("#authNameField");
  const submitButton = document.querySelector("#authSubmitButton");
  const authTitle = document.querySelector("#authTitle");
  const authSubtitle = document.querySelector("#authSubtitle");

  if (nameField) nameField.hidden = !isRegistering;
  if (submitButton) submitButton.textContent = isRegistering ? "Create account" : "Sign in";
  if (authTitle) authTitle.textContent = isRegistering ? "Create your account" : "Welcome back";
  if (authSubtitle) {
    authSubtitle.textContent = isRegistering
      ? "Start keeping your EngineerOS progress in one place."
      : "Sign in to continue building your EngineerOS.";
  }

  for (const button of document.querySelectorAll("[data-auth-mode]")) {
    button.classList.toggle("active", button.dataset.authMode === mode);
  }

  document.querySelector("#authForm")?.setAttribute("data-mode", mode);
  showAuthMessage("");
}

function setupAuthForm() {
  const authForm = document.querySelector("#authForm");

  if (!authForm) {
    return;
  }

  for (const button of document.querySelectorAll("[data-auth-mode]")) {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mode = authForm.dataset.mode;
    const payload = {
      email: document.querySelector("#authEmail").value,
      password: document.querySelector("#authPassword").value,
    };

    if (mode === "register") {
      payload.name = document.querySelector("#authName").value;
    }

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to complete this request");
      }

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: data.token, user: data.user }),
      );
      window.location.href = "../index.html";
    } catch (error) {
      showAuthMessage(error.message);
    }
  });

  setAuthMode("login");
}

window.engineerOSAuth = { getAuthToken, getStoredSession };

updateProfileName();
setupAuthForm();
