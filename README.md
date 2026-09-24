# Nebula Mail - AI-Powered Mail Web Application

Nebula Mail is a modern web application where an integrated AI Copilot programmatically controls the interface—painting forms, filling fields visibly, executing complex search filters, navigating views, and syncing messages in real-time.

---

## 🌟 Key Features

### 1. Programmatic AI UI Controller
- **Compose & Visibly Fill**: natural language commands like *"Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'"* open the compose view and **visibly populate each field character-by-character**.
- **Search & Filter UI Update**: prompts like *"Show me emails from the last 10 days"* or *"Show only unread emails from this week"* update the main UI inbox list and filter controls bi-directionally.
- **Navigate & Open**: prompts like *"Open the latest email from David"* automatically navigate the app view directly to David's email reader.
- **Context Awareness**: asking *"Reply to this"* while reading an email automatically extracts recipient, subject (`Re:`), and pre-fills an appropriate draft.

### 2. Real-Time Push Sync Engine
- Built-in Server-Sent Events (SSE) push channel at `/api/mail/sync` pushing live emails directly to connected clients without requiring manual page refresh.
- Includes a live push simulator button in the sidebar for instant evaluation testing.

### 3. Dual-Mode Mail Provider Integration
- **Interactive Seed Mode**: Pre-populated with realistic threads (Sarah, David, John, Alex, GitHub) with realistic timestamps for immediate out-of-the-box evaluation.
- **Real Provider Support**: Integration endpoints for **Resend API** and **SMTP / Nodemailer** for sending real production emails.
- **Custom API Key Configuration**: UI settings modal allowing evaluation with custom Gemini / OpenAI API keys or built-in intent parsing.

### 4. Bonus Enhancements
- **Human-in-the-Loop Confirmation**: AI draft approval bar before sending.
- **Rich UI Rendering in Chat**: Interactive email preview cards and filter result badges rendered directly inside assistant messages.
- **Conversation Threading**: Grouping emails by thread topic with inline reply triggers.
- **Dark Mode Glassmorphism**: Neon accent aesthetics, custom scrollbar styling, responsive layout.
- **Automated Test Suite**: 9 unit & integration tests covering store state, filter rules, and AI tool parsing.

---

## 🛠️ Architecture Decisions & Trade-Offs

1. **State-Driven UI Dispatcher (Zustand)**:
   - *Decision*: We centralized UI state (active view, filter parameters, compose state, chat transcript) in a unified Zustand store.
   - *Trade-off*: Provides instantaneous bi-directional UI synchronization when AI tools execute actions, avoiding messy re-render cascades.

2. **Visible Character-by-Character Form Typing**:
   - *Decision*: Implemented step-by-step state animation intervals during `animateAutoFillCompose`.
   - *Benefit*: Evaluators can visually witness the AI "typing into fields", fulfilling the core requirement that the AI paints the UI in front of the user.

3. **Dual-Layer Intent Processor**:
   - *Decision*: Created a robust local tool-calling parser that extracts structured payloads (`compose`, `filter`, `navigate`, `reply`, `forward`, `clear_filters`) while also supporting custom Gemini/OpenAI API keys via `/api/chat`.
   - *Benefit*: The app works 100% reliably out-of-the-box without requiring mandatory external API keys to demonstrate full UI control capabilities.

---

## 🚀 Setup & Local Execution

### Prerequisites
- Node.js v18+ and npm

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Test Suite
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

---

## 👥 Repository Collaborators

Private repository access for evaluators:
- `Aswath363`
- `akshaiP`
- `ashwanthnebula`

---

## 🔮 What I'd Improve with More Time

1. **WebSockets / Webhooks Integration**: Expand SSE push channel into bidirectional WebSocket connection for instant typing indicators.
2. **Rich Text & WYSIWYG Formatting**: Integrate Tiptap / Quill for rich formatting, inline image attachments, and table rendering in email compose.
3. **Voice Command Integration**: Add Speech-to-Text web API so users can control the UI completely hands-free via voice natural language.
