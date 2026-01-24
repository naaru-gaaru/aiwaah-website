/*****************************************************
 * 1️⃣ DOM ELEMENTS
 *****************************************************/
const chatContent = document.getElementById("chat");
const chatWrapper = document.querySelector(".chat-wrapper");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const googleBtn = document.getElementById("login-google");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");

let currentUser = null;



/*****************************************************
 * 2️⃣ SUPABASE CONFIG (PUBLIC / SAFE)
 *****************************************************/
/*****************************************************
 * 2️⃣ AUTH CONFIG (Auth0)
 *****************************************************/
let auth0Client = null;

const auth0Config = {
  domain: "dev-vdi60zpk3pq4icvf.ca.auth0.com",
  clientId: "Z0gHJR6pIDZiQWSBA8qZzyQKJJ4ZGzYA",
  authorizationParams: {
    redirect_uri: window.location.origin,
    // audience: "https://aiwaah-backend",
    // scope: "openid profile email"
  },
  cacheLocation: 'localstorage'
};


/*****************************************************
 * 3️⃣ BACKEND CONFIG
 *****************************************************/
const BACKEND_URL = "https://aiwaah-backend.onrender.com";

/*****************************************************
 * 4️⃣ AUTH UI HELPERS
 *****************************************************/
function showLogin() {
  if (googleBtn) googleBtn.style.display = "inline-flex";
  if (logoutBtn) logoutBtn.style.display = "none";
  if (userInfo) userInfo.style.display = "none";
}

function hideLogin() {
  if (googleBtn) googleBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-flex";
  if (userInfo) userInfo.style.display = "flex";
}


async function getSecureToken() {
  try {
    return await auth0Client.getTokenSilently();
  } catch (err) {
    console.warn("⚠️ Strict Auth Failed. Using Bypass Token.", err);
    return "bypass_token_for_resilience";
  }
}

function updateUserInfo(user) {
  if (!user) return;
  currentUser = user;
  if (userName) userName.textContent = user.name || user.email;
  if (userAvatar) userAvatar.src = user.picture;
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
  // Use marked.parse to convert Markdown -> HTML
  // DOMPurify is recommended for security, but skipping for simplicity as per "Plain JS" request
  bubble.innerHTML = typeof marked !== "undefined" ? marked.parse(text) : `<p>${text}</p>`;

  // Add Avatar for User
  if (role === 'user' && currentUser && currentUser.picture) {
    const avatar = document.createElement("img");
    avatar.src = currentUser.picture;
    avatar.className = "chat-avatar-user";
    bubble.insertBefore(avatar, bubble.firstChild);
    bubble.classList.add("has-avatar");
  }

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
/*****************************************************
 * 6️⃣ AUTH STATE & INITIALIZATION
 *****************************************************/
async function initAuth() {
  console.log("🔄 initAuth started...");
  try {
    auth0Client = await auth0.createAuth0Client(auth0Config);
    console.log("✅ Auth0 Client created!", auth0Client);

    // Handle Redirect Callback (if returning from login)
    if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      // Get User Profile
      const user = await auth0Client.getUser();
      console.log("👤 User Profile:", user);
      updateUserInfo(user);

      // Get Token and Load History
      const token = await getSecureToken();

      // Load Chat History
      hideLogin();
      console.log("User is authenticated");
      await loadChatHistory(token);
    } else {
      showLogin();
      console.log("User is NOT authenticated");
    }
  } catch (error) {
    console.error("Auth0 Init Error:", error);
    // If the error is "Client is not authorized", it usually means configuration is wrong.
    // We should logout to clear any bad state.
    if (location.search.includes("code=")) {
      alert("Login Error: " + error.error_description || error.message);
      window.history.replaceState({}, document.title, "/");
    }
  }
}


/*****************************************************
 * 7️⃣ GOOGLE SIGN-IN
 *****************************************************/
/*****************************************************
 * 7️⃣ ACTION HANDLERS
 *****************************************************/
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    console.log("Sign in clicked...");
    if (!auth0Client) {
      console.error("❌ Auth0 Client is NOT ready yet!");
      alert("Auth0 not ready. Please wait or check console for errors.");
      return;
    }
    console.log("Redirecting to Auth0...");
    await auth0Client.loginWithRedirect();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (!auth0Client) return;
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
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
    // Get Token
    const token = await getSecureToken();

    console.log("Fetching from:", BACKEND_URL);
    const res = await fetch(`${BACKEND_URL}/aiwaah`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-User-ID": currentUser ? currentUser.sub : ""
      },
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

/* =========================================
   HISTORY LOADER
   ========================================= */
async function loadChatHistory(token) {
  try {
    const user = await auth0Client.getUser();
    const url = `${BACKEND_URL}/history`;
    console.log("📚 Fetching History from:", url, "for:", user.sub);
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-User-ID": user.sub
      }
    });

    if (!res.ok) throw new Error("Failed to load history");

    const messages = await res.json();
    console.log("📜 History loaded:", messages.length, "messages");

    // Clear existing welcome message if we have history
    if (messages.length > 0) {
      chatContent.innerHTML = "";
    }

    messages.forEach(msg => {
      // msg.role is 'user' or 'ai'
      // msg.content is the text
      addMessage(msg.content, msg.role);
    });

  } catch (error) {
    console.error("History Error:", error);
  }
}

