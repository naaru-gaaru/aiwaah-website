# 🚀 How to Publish Your Website (The Easy Way)

We have built the new "Royal Genie" theme locally on your computer. Now we need to send it to the internet so everyone can see it.

 Think of it like this:
1.  **Your Computer**: The workshop where we built the toy.
2.  **GitHub**: The warehouse where we store the toy.
3.  **Vercel**: The store that shows the toy to the world.

I have already done the packing (Committed the code). Now you just need to drive the truck to the warehouse (Push to GitHub).

## Step 1: Open Your Terminal
You are likely already looking at it, but if not, look for the "Terminal" tab in your code editor.

## Step 2: Copy and Paste This Command
Type (or copy) this exact line into the terminal and press **Enter**:

```bash
git push -u origin main
```

## Step 3: The "Secret Handshake" (Login)
-   If a window pops up asking you to sign in to GitHub, **click "Sign in with Browser"**.
-   If it asks for a `Username` and `Password` in the terminal:
    -   **Username**: Your GitHub username (`naaru-gaaru`).
    -   **Password**: This is tricky! It's usually a **Personal Access Token**, not your regular password.
    -   *Easier Path:* If you have GitHub Desktop installed, you can open this folder there and click "Publish Branch".

## Step 4: Watch the Magic
Once the command finishes and says `Branch 'main' set up to track remote branch...`, you are done!
-   Go to your **Vercel Dashboard**.
-   You will see a new "Deployment" building automatically.
-   In a few seconds, your site will be live!

## Troubleshooting

### "Permission denied" or "403"
-   It means the "keys" didn't work.
-   Try using the GitHub Desktop app instead.

### "Updates were rejected" or "Fetch first"
-   This means GitHub has an old version that conflicts with our new one.
-   **Solution**: Force GitHub to accept our version.
-   Run this command:
    ```bash
    git push -u origin main --force
    ```
