🎯 What We're Building

A Notepad extension that lets you:
✏️ Write and edit text notes in a popup
💾 Save notes automatically using Chrome Storage
🖱️ Right-click any webpage to save selected text or URLs as notes

🏗️ Extension Architecture

┌─────────────────────────────────────────────────────────┐
│                    Your Browser                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐     ┌──────────────────────────────┐ │
│  │   Popup UI   │     │     Background Script        │ │
│  │              │     │                              │ │
│  │ • View notes │◄───►│ • Manages context menus      │ │
│  │ • Add notes  │     │ • Handles right-click saves  │ │
│  │ • Delete     │     │ • Stores notes from context  │ │
│  └──────┬───────┘     └──────────┬───────────────────┘ │
│         │                        │                       │
│         └──────────┬─────────────┘                       │
│                    │                                     │
│              ┌─────▼─────┐                               │
│              │  Storage  │                               │
│              │  API      │                               │
│              │           │                               │
│              │  Notes    │                               │
│              │  are      │                               │
│              │  saved    │                               │
│              │  here     │                               │
│              └───────────┘                               │
└─────────────────────────────────────────────────────────┘

📁 File Structure
notepad-extension/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── popup.css
└── consts.js