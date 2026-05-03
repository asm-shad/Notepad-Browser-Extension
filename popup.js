import { STORAGE_KEY_NOTES } from './consts.js';

// DOM elements
const noteInput = document.getElementById('noteInput');
const saveBtn = document.getElementById('saveBtn');
const notesContainer = document.getElementById('notesContainer');

// Add a new note
const addNote = (text) => {
  if (!text.trim()) {
    alert('Please enter some text!');
    return false;
  }
  
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    notes.push(text.trim());
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes }, () => {
      noteInput.value = '';
    });
  });
  return true;
};

// Delete a note by index
const deleteNote = (index) => {
  if (confirm('Delete this note?')) {
    chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
      const notes = res[STORAGE_KEY_NOTES] || [];
      notes.splice(index, 1);
      chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes });
    });
  }
};

// Copy note to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  // Optional: show a small tooltip
};

// Render all notes with additional features
const renderNotes = (notes) => {
  if (!notes || notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-message">
        ✨ No notes yet.<br>
        • Write one above, or<br>
        • Right-click any page to save text/URL
      </div>
    `;
    return;
  }
  
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    
    const noteText = document.createElement('div');
    noteText.className = 'note-text';
    noteText.textContent = note;
    
    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '📋';
    copyBtn.title = 'Copy to clipboard';
    copyBtn.style.cssText = `
      position: absolute;
      bottom: 5px;
      right: 30px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 3px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 10px;
    `;
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(note);
      copyBtn.textContent = '✓';
      setTimeout(() => { copyBtn.textContent = '📋'; }, 1000);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete note';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(index);
    });
    
    noteDiv.appendChild(noteText);
    noteDiv.appendChild(copyBtn);
    noteDiv.appendChild(deleteBtn);
    notesContainer.appendChild(noteDiv);
  });
};

// Listen for storage changes (updates from background script)
chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY_NOTES]) {
    renderNotes(changes[STORAGE_KEY_NOTES].newValue || []);
  }
});

// Load notes on popup open
chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
  renderNotes(res[STORAGE_KEY_NOTES] || []);
});

// Save button click handler
saveBtn.addEventListener('click', () => {
  addNote(noteInput.value);
});

// Save on Ctrl+Enter
noteInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    addNote(noteInput.value);
  }
});

// Optional: Show total note count
const updateNoteCount = () => {
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const count = (res[STORAGE_KEY_NOTES] || []).length;
    console.log(`You have ${count} note(s)`);
  });
};
updateNoteCount();