# 📝 Notepad Extension

A powerful browser extension that lets you save notes, capture web content, and organize your thoughts directly from your browser!

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [File Structure](#file-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Enhancements](#enhancements)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Notepad Extension is a powerful tool that transforms your browser into a note-taking powerhouse. Whether you're researching, browsing, or just need a quick place to jot down thoughts, this extension has you covered!

### Key Highlights

- ✏️ **Quick Notes** - Write notes directly from the popup
- 🖱️ **Context Menu** - Save any text or URL with right-click
- 💾 **Persistent Storage** - Notes survive browser restarts
- 🔍 **Search** - Find notes instantly
- 📤 **Export/Import** - Backup and restore your notes
- 📊 **Statistics** - Track word/character count

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| Quick Note Creation | Write and save notes instantly from the popup |
| Context Menu Integration | Right-click any webpage to save selected text, page URL, or link URL |
| Automatic Timestamps | Every note gets a timestamp automatically |
| Persistent Storage | Notes are saved using Chrome Storage API |
| Delete Confirmation | Prevent accidental deletions |
| Copy to Clipboard | One-click copy any note |

### Enhanced Features

| Feature | Description |
|---------|-------------|
| 🔍 Search Notes | Real-time search with highlight matching |
| 📊 Statistics Dashboard | View character count, word count, and note count |
| 📤 Export Notes | Backup your notes to JSON file |
| 📂 Import Notes | Restore notes from backup file |
| 🎨 Beautiful UI | Modern design with smooth animations |
| 📅 Timestamp Display | Each note shows when it was created |
| 📖 Bold Metadata | Source information is bolded for emphasis |

## 📸 Screenshots

### Popup Interface

┌─────────────────────────────────────────────────────────┐
│ 📝 My Notes │
├─────────────────────────────────────────────────────────┤
│ 🔍 [Search notes............................] │
├─────────────────────────────────────────────────────────┤
│ 📊 1250 characters | 180 words | 15 notes │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────┐ │
│ │ 📅 5/3/2026, 2:30:45 PM │ │
│ │ 📖 From "Google": │ │
│ │ Selected text content appears here │ │
│ │ [📋] [×] │ │
│ └───────────────────────────────────────────────────┘ │
│ │
│ [New Note Input Area] │
│ [💾 Export] [📂 Import] │
└─────────────────────────────────────────────────────────┘


### Context Menu

Right-click on any webpage:
├── 📝 Save selected text to Notepad
├── 🔗 Save page URL to Notepad
└── 🔗 Save link URL to Notepad (on links)


## 🔧 Installation

### From Chrome Web Store (Recommended)

1. Visit the Chrome Web Store listing (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `notepad-extension` folder
6. The extension icon should appear in your toolbar

### Firefox Installation (Coming Soon)

## 📖 Usage Guide

### Quick Start

1. Click the extension icon in your toolbar
2. Type a note in the text area
3. Click "Save Note" or press `Ctrl + Enter`
4. Your note appears in the list below

### Saving Web Content

#### Save Selected Text
1. Highlight text on any webpage
2. Right-click on the highlighted text
3. Select "Save selected text to Notepad"
4. ✅ Note saved with page title and timestamp

#### Save Page URL
1. Right-click anywhere on a webpage (no text selection needed)
2. Select "Save page URL to Notepad"
3. ✅ URL saved with page title and timestamp

#### Save Link URL
1. Right-click on any hyperlink
2. Select "Save link URL to Notepad"
3. ✅ Link URL saved with timestamp

### Managing Notes

| Action | How to |
|--------|--------|
| Delete note | Click the × button on any note |
| Copy note | Click the 📋 button to copy to clipboard |
| Search notes | Type in the search box above notes |
| Export all notes | Click "Export Notes" button |
| Import notes | Click "Import Notes" and select a JSON backup |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Save current note (from textarea) |
| `Ctrl + Shift + N` | Open Notepad (if configured) |

## 📁 File Structure
notepad-extension/
├── manifest.json # Extension configuration
├── background.js # Service worker (context menus)
├── popup.html # Main UI
├── popup.js # Popup logic
├── popup.css # Styling
├── consts.js # Constants
├── notes.png # 16px icon
├── notepad.png # 48px icon
├── notepad.png # 128px icon
└── README.md # This file
