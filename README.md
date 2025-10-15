# 🕊️ SPEAKLIFE APP

SpeakLIFE is a chat-based counseling platform that intelligently detects emergency messages—such as signs of suicidal intent—sending instant alerts to emergency response communities through Telegram, while providing insightful annual statistics on critical message trends.

---

## 🧠 Overview

SpeakLIFE empowers people to share their feelings through chat-based counseling sessions while using AI and workflow automation to detect critical or emergency messages.  
When messages indicate high-risk intent (e.g., suicidal thoughts or severe distress), the system automatically triggers alerts to emergency response teams via Telegram and logs data for long-term statistical analysis.

---

## ✨ Features

- 💬 Real-time chat-based counseling interface  
- 🧠 AI-powered detection of emergency or high-risk messages  
- 🚨 Automatic Telegram notifications to emergency teams  
- 📊 Statistical dashboard for annual report insights  
- 🔒 Privacy-first design with anonymous user identity  

---

## ⚙️ Prerequisites

Before running SpeakLIFE, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [n8n](https://n8n.io/) – for workflow automation
- [ngrok](https://ngrok.com/) – to expose local webhook URLs
- A **Telegram Bot** (created via [@BotFather](https://t.me/BotFather))

---

## 🚀 Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/galangnovi/SpeakLIFE.git
cd SpeakLIFE
```

2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Setup n8n (Workflow Automation)

Install n8n globally:
```bash
npm install -g n8n
```

Then start it:

```bash
n8n start
```

Access n8n via browser:
👉 http://localhost:5678

4️⃣ Import Workflow

In n8n dashboard, click Import from File

Upload the workflow file included in this repository:

speaklife-n8n.json


Save and activate the workflow

This workflow:

Detects emergency keywords in messages

Sends alerts to Telegram emergency bot

Logs all detected messages for reporting

5️⃣ Expose Webhook with ngrok

Run ngrok to make your local n8n publicly accessible:

```bash
ngrok http 5678
```

You’ll get a public URL like:

https://abcd1234.ngrok.io


Copy that URL and set it in your .env file under N8N_WEBHOOK_URL.

6️⃣ Setup Environment Variables

Create a new file named .env in the root folder and add the following:

# App Config
PORT=3000
N8N_WEBHOOK_URL=https://your-ngrok-url.ngrok.io/webhook/speaklife
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id


💡 Tip:

You can get TELEGRAM_BOT_TOKEN from @BotFather
.

To find your TELEGRAM_CHAT_ID, start a chat with @userinfobot
.

7️⃣ Connect Telegram Notifications

To activate Telegram notifications, press the button below and click Start in Telegram:

👉 Start Telegram Notifications

This allows you (or your emergency response group) to receive instant alerts whenever an emergency message is detected by the AI workflow.

8️⃣ Run the Application

Once everything is configured, start the app:

```bash
npm run dev
```

Then open your browser:
👉 http://localhost:3000

🧩 Architecture Overview
User Chat
   │
   ▼
SpeakLIFE App (Frontend)
   │
   ▼
n8n Workflow  ←→  Telegram Alert Bot
   │
   ▼
Statistics Logger / Annual Reports


Frontend: React + TypeScript (chat interface)

n8n: Detects messages and triggers automation

Telegram: Sends alerts to emergency responders

🛠 Tech Stack
Layer	Technology
Frontend	React + TypeScript
Automation	n8n
Integration	Telegram Bot API + ngrok
Styling	Tailwind CSS
Deployment	Vercel (Frontend), Local n8n instance
🧾 Example Workflow Trigger (Concept)

A user types:

"I don’t want to live anymore"

SpeakLIFE sends this text to n8n.

The workflow analyzes message keywords (AI/NLP).

If critical intent is detected →
🔔 A Telegram alert is sent to responders instantly.

Message is stored for annual report analytics.

💬 Contributing

Contributions are welcome!
If you'd like to improve the AI model, workflow, or UI, feel free to submit a pull request or open an issue.

❤️ Acknowledgment

SpeakLIFE is built with compassion to provide hope and connection for anyone who needs to be heard.
Together, let’s make every voice matter.
