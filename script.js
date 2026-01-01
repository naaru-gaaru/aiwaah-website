const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

addMessage(
  "✨ Greetings, traveler! I am AIwaah, your genie of financial wisdom. Which realm do you hail from — United States, Canada, or Trans-Border?",
  "ai"
);

const BACKEND_URL = "https://aiwaah-backend.onrender.com";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value;
  input.value = "";

  addMessage(message, "user");

  const res = await fetch("YOUR_BACKEND_URL/aiwaah", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  addMessage(data.reply, "ai");
});
