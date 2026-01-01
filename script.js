const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

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
  const message = input.value;
  input.value = "";

  addMessage(message, "user");
  addTypingIndicator();

  const res = await fetch(`${BACKEND_URL}/aiwaah`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message })
});

const data = await res.json();
removeTypingIndicator();
addMessage(data.reply, "ai");

});


