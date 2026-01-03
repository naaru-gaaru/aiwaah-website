const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const SUPABASE_URL = "https://rqwnwkmjeiyagvyzdumi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd253a21qZWl5YWd2eXpkdW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczOTI4NzMsImV4cCI6MjA4Mjk2ODg3M30.T7h97fh3jgUC7NVa9O3Nz024ZWuR6Wz4d_fx7MKE5mo";

const supabase = supabaseJs.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
const googleBtn = document.getElementById("login-google");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  });
}

function setInputDisabled(state) {
  input.disabled = state;
}

function addTypingIndicator() {
  const div = document.createElement("div");
  div.className = "message ai typing";
  div.id = "typing-indicator";
  div.textContent = "🧞‍♂️ AiWaah is consulting the ancient scrolls…";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;

  // Convert AI text into readable HTML
  const formatted = text
    .replace(/^(.+?):$/gm, "<div class='section-title'>$1</div>")
    .replace(/^[-•]\s+(.*)$/gm, "<li>$1</li>")
    .replace(/^(🟢|🔹|⭐|💰|📊|💳|📜|✨)\s+(.*)$/gm, "<li>$1 $2</li>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>");

  const wrapped = formatted.includes("<li>")
    ? `<ul>${formatted}</ul>`
    : `<p>${formatted}</p>`;

  // Scroll of Wisdom → class-based styling
  if (text.includes("📜 Scroll of Wisdom")) {
    div.classList.add("scroll");
  }

  div.innerHTML = wrapped;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


addMessage(
  "✨ Greetings, traveler! I am AiWaah, your genie of financial wisdom. Which realm do you hail from — United States, Canada, or US Trans-Border?",
  "ai"
);

const BACKEND_URL = "https://aiwaah-backend.onrender.com";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  setInputDisabled(true);

  addMessage(message, "user");
  addTypingIndicator();

  try {
    const res = await fetch(`${BACKEND_URL}/aiwaah`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    removeTypingIndicator();
    addMessage(data.reply, "ai");
  } catch (err) {
    removeTypingIndicator();
    addMessage("⚠️ The genie’s magic faltered. Please try again.", "ai");
  } finally {
    setInputDisabled(false);
  }
});







