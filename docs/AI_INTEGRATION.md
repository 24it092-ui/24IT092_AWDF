# AI API Integration into a Web Application (Practical 13)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** NEEL SHAH  
**Roll No:** 24IT092  
**Institute:** CSPIT, CHARUSAT  

---

## 1. Architectural Diagram & Security Model

```
   React Frontend (Client)
             │
             │ POST /api/ai/generate-description { title }
             ▼
   Express Backend Server (Port 5001)
   ├── 1. Rate Limiting Check (Max 1 call / 10s per client)
   ├── 2. Reads process.env.OPENAI_API_KEY (Secured Server-Side)
   ├── 3. Calls OpenAI / Gemini API (or triggers Graceful Fallback)
   └── 4. Graceful Degradation Handling
             │
             ▼
   Returns { description, fallback: false/true, disclaimer }
             │
             ▼
   React UI Form: Editable suggested description + AI disclaimer
```

---

## 2. Key Implementation Features

1. **Server-Side API Key Storage**:
   - `OPENAI_API_KEY` is kept in `.env` and excluded from Git via `.gitignore`. The key is never transmitted or exposed to browser DevTools.
2. **Graceful Degradation Engine**:
   - If the external API times out, has an invalid key, or quota limit, the backend catches the error and generates an actionable software task description without crashing the app.
3. **Editable Suggestion & User Control**:
   - The AI output populates a textarea as an editable draft rather than forcibly submitting, leaving the user in full control.
4. **Rate Limiting Protection**:
   - Protects against rapid repeated calls with a 10-second client-cooldown window (`429 Too Many Requests`).
5. **AI Disclaimer**:
   - Clearly flags the generated output as AI-suggested content.

---

## 3. Answers to Key Viva Questions

### Q1. Why must the AI API key be called from the backend rather than directly from the React frontend?
Any code running in the React frontend is downloaded directly into the user's browser. If the API key were placed in client-side code, it would be instantly visible in browser network requests or bundle sources, exposing it to theft, unauthorized usage, and massive billing charges. Calling via a backend endpoint shields the secret server-side.

### Q2. What does 'graceful degradation' mean in this context?
Graceful degradation ensures that when an external dependency (like OpenAI or Gemini) experiences an outage, network drop, or rate limit, the primary application does not crash or block the user. The app gracefully falls back to local heuristic/offline generation, allowing the user to create tasks uninterrupted.

### Q3. What are the privacy and governance implications of sending task data to an external AI API?
- **Data Privacy**: Third-party AI models may log user prompts. 
- **Prohibited Data**: Personally Identifiable Information (PII), passwords, proprietary source secrets, and financial/medical details must never be sent in prompts.
- **Compliance**: Enterprise applications must ensure compliance with GDPR, HIPAA, and university data governance guidelines.
