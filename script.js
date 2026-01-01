const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

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

  // ✨ Special styling for Scroll of Wisdom
  if (text.includes("📜 Scroll of Wisdom")) {
    div.style.border = "1px solid gold";
    div.style.background = "linear-gradient(135deg, #f5e6a8, #d4af37)";
    div.style.color = "#1b2b4f";
  }

  div.textContent = text;
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





