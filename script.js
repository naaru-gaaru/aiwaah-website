/*****************************************************
 * 1️⃣ DOM ELEMENTS
 *****************************************************/
const chatContent = document.getElementById("chat");
const chatWrapper = document.querySelector(".chat-wrapper");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const googleBtn = document.getElementById("login-google");

/*****************************************************
 * 2️⃣ SUPABASE CONFIG (PUBLIC / SAFE)
 *****************************************************/
/*****************************************************
 * 2️⃣ SUPABASE CONFIG (PUBLIC / SAFE)
 *****************************************************/
const SUPABASE_URL = "https://rqwnwkmjeiyagvyzdumi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd253a21qZWl5YWd2eXpkdW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczOTI4NzMsImV4cCI6MjA4Mjk2ODg3M30.T7h97fh3jgUC7NVa9O3Nz024ZWuR6Wz4d_fx7MKE5mo";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/*****************************************************
 * 3️⃣ BACKEND CONFIG
 *****************************************************/
const BACKEND_URL = "https://aiwaah-backend.onrender.com";

/*****************************************************
 * 4️⃣ AUTH UI HELPERS
 *****************************************************/
function showLogin() {
  if (googleBtn) googleBtn.style.display = "inline-flex";
}

function hideLogin() {
  if (googleBtn) googleBtn.style.display = "none";
}

/*****************************************************
 * 5️⃣ CHAT UI HELPERS
 *****************************************************/
function scrollToBottom() {
  chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

function addMessage(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  bubble.innerHTML = `<p>${text}</p>`;
  chatContent.appendChild(bubble);
  scrollToBottom();
}

function addTypingIndicator() {
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.className = "message ai typing";
  typing.innerHTML = "🧞‍♂️ AiWaah is consulting the ancient scrolls…";
  chatContent.appendChild(typing);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

/*****************************************************
 * 6️⃣ AUTH STATE (SINGLE SOURCE OF TRUTH)
 *****************************************************/
async function initAuth() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    hideLogin();
  } else {
    showLogin();
  }
}

/* Listen ONCE — do NOT duplicate this */
supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (session) {
    hideLogin();
  } else {
    showLogin();
  }
});

/*****************************************************
 * 7️⃣ GOOGLE SIGN-IN
 *****************************************************/
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
  });
}

/*****************************************************
 * 8️⃣ INITIAL GREETING
 *****************************************************/
addMessage(
  "✨ Greetings, traveler! I am **AiWaah**, your CFP & CPA financial genie. Ask me about **United States 🇺🇸, Canada 🇨🇦, or US cross-border** financial wisdom.",
  "ai"
);

/*****************************************************
 * 9️⃣ CHAT SUBMIT HANDLER
 *****************************************************/
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Submit fired");

  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  addMessage(message, "user");
  addTypingIndicator();

  try {
    console.log("Fetching from:", BACKEND_URL);
    const res = await fetch(`${BACKEND_URL}/aiwaah`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    removeTypingIndicator();
    addMessage(data.reply || "⚠️ The genie is momentarily silent.", "ai");
  } catch (err) {
    console.error("Chat Error:", err);
    removeTypingIndicator();
    addMessage(`⚠️ Connection failed: ${err.message}. Is the backend awake?`, "ai");
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
});

/*****************************************************
 * 🔟 INIT
 *****************************************************/
initAuth();
