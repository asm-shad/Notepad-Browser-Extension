import { STORAGE_KEY_NOTES } from './consts.js';

// ============================================
// DOM ELEMENTS
// ============================================
const noteInput = document.getElementById('noteInput');
const saveBtn = document.getElementById('saveBtn');
const notesContainer = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const charCountSpan = document.getElementById('charCount');
const wordCountSpan = document.getElementById('wordCount');
const noteCountSpan = document.getElementById('noteCount');

// Store for filtering
let allNotes = [];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get timestamp for notes
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString(); // "5/3/2026, 2:30:45 PM"
};

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Escape regex special characters for search
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Format note for display with highlighted timestamp
const formatNoteForDisplay = (note) => {
  // Extract timestamp: [5/3/2026, 12:04:37 PM] 
  const timestampMatch = note.match(/\[(.*?)\]\s*(.*)/);
  
  if (!timestampMatch) {
    return { timestamp: null, metadata: '', content: note };
  }
  
  const timestamp = timestampMatch[1];
  let remaining = timestampMatch[2];
  
  // Extract bold part: From "Title":
  let metadata = '';
  let content = remaining;
  
  // Look for From "something": pattern
  const fromMatch = remaining.match(/(From\s+"[^"]+"\s*:)\s*(.*)/);
  if (fromMatch) {
    metadata = fromMatch[1];  // This is "From "Chrome Extension...":"
    content = fromMatch[2];   // This is the actual note text
  }
  
  // Also handle URL pattern with newline
  if (!metadata && remaining.includes('\n')) {
    const parts = remaining.split('\n');
    metadata = parts[0];
    content = parts.slice(1).join('\n');
  }
  
  return {
    timestamp: timestamp,
    metadata: metadata,
    content: content.trim()
  };
};

// ============================================
// CORE NOTE FUNCTIONS (ENHANCED)
// ============================================

// Add a new note (with timestamp)
const addNote = (text) => {
  if (!text.trim()) {
    alert('Please enter some text!');
    return false;
  }
  
  const timestampedNote = `[${getTimestamp()}] ✏️ ${text.trim()}`;
  
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    notes.push(timestampedNote);
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes }, () => {
      noteInput.value = '';
      updateInputStats(); // Update live stats
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

// Get original note index when filtered
const getOriginalNoteIndex = (filteredIndex, filterText) => {
  if (!filterText.trim()) return filteredIndex;
  
  const query = filterText.toLowerCase().trim();
  let originalIndex = -1;
  let currentFilteredIndex = 0;
  
  for (let i = 0; i < allNotes.length; i++) {
    if (allNotes[i].toLowerCase().includes(query)) {
      if (currentFilteredIndex === filteredIndex) {
        originalIndex = i;
        break;
      }
      currentFilteredIndex++;
    }
  }
  return originalIndex;
};

// Copy note to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

// ============================================
// STATISTICS FUNCTIONS (ENHANCEMENT 4)
// ============================================

// Update statistics (word/char/note count)
const updateStats = () => {
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    
    // Note count
    if (noteCountSpan) noteCountSpan.textContent = `${notes.length} notes`;
    
    // Calculate total characters
    const totalChars = notes.join('').length;
    if (charCountSpan) charCountSpan.textContent = `${totalChars} characters`;
    
    // Calculate total words
    const allText = notes.join(' ');
    const words = allText.trim() ? allText.trim().split(/\s+/).length : 0;
    if (wordCountSpan) wordCountSpan.textContent = `${words} words`;
  });
};

// Real-time character count while typing
const updateInputStats = () => {
  const text = noteInput.value;
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Optional: Could display this in UI
  console.log(`Current note: ${charCount} chars, ${wordCount} words`);
};

// ============================================
// EXPORT/IMPORT FUNCTIONS (ENHANCEMENT 3)
// ============================================

// Export notes to JSON file
const exportNotes = () => {
  chrome.storage.local.get(null, (allData) => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      notes: allData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    chrome.downloads.download({
      url: url,
      filename: `notepad-backup-${date}.json`,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Export failed:", chrome.runtime.lastError);
        alert("❌ Export failed. Make sure you have 'downloads' permission in manifest.");
      } else {
        alert("✅ Notes exported successfully!");
      }
      URL.revokeObjectURL(url);
    });
  });
};

// Import notes from JSON file
const importNotes = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        
        if (imported.notes) {
          // Merge imported notes with existing
          chrome.storage.local.get(null, (existing) => {
            const merged = { ...existing, ...imported.notes };
            chrome.storage.local.set(merged, () => {
              alert("✅ Notes imported successfully!");
              // Refresh stats after import
              setTimeout(() => updateStats(), 100);
            });
          });
        } else if (Array.isArray(imported)) {
          // Handle old format (just array of notes)
          chrome.storage.local.set({ [STORAGE_KEY_NOTES]: imported }, () => {
            alert("✅ Notes imported successfully!");
            updateStats();
          });
        } else {
          alert("❌ Invalid backup file format");
        }
      } catch (err) {
        alert("❌ Error parsing backup file");
        console.error(err);
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
};

// ============================================
// RENDER FUNCTION (WITH SEARCH & TIMESTAMPS)
// ============================================

// Render all notes with search filtering and timestamp display
const renderNotes = (notes, filterText = '') => {
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
  
  allNotes = [...notes];
  
  // Apply filter
  let filteredNotes = notes;
  if (filterText && filterText.trim()) {
    const query = filterText.toLowerCase().trim();
    filteredNotes = notes.filter(note => 
      note.toLowerCase().includes(query)
    );
    
    if (filteredNotes.length === 0) {
      notesContainer.innerHTML = `
        <div class="empty-message">
          🔍 No notes matching "${escapeHtml(filterText)}"
        </div>
      `;
      return;
    }
  }
  
  notesContainer.innerHTML = '';
  
  filteredNotes.forEach((note, filteredIndex) => {
    const originalIndex = getOriginalNoteIndex(filteredIndex, filterText);
    const formatted = formatNoteForDisplay(note);
    
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    
    const noteText = document.createElement('div');
    noteText.className = 'note-text';
    
    // Build HTML - clean and simple
    let html = '';
    
    // Timestamp line
    if (formatted.timestamp) {
      html += `<div class="timestamp">📅 ${escapeHtml(formatted.timestamp)}</div>`;
    }
    
    // Bold metadata line
    if (formatted.metadata) {
      html += `<div class="note-meta">${escapeHtml(formatted.metadata)}</div>`;
    }
    
    // Content line
    let content = escapeHtml(formatted.content);
    
    // Highlight search terms
    if (filterText && filterText.trim()) {
      const query = escapeRegex(filterText.trim());
      const regex = new RegExp(`(${query})`, 'gi');
      content = content.replace(regex, '<mark>$1</mark>');
    }
    
    html += `<div class="note-content">${content}</div>`;
    noteText.innerHTML = html;
    
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '📋';
    copyBtn.title = 'Copy to clipboard';
    copyBtn.style.cssText = `
      position: absolute;
      bottom: 8px;
      right: 35px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 6px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 11px;
    `;
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(note);
      copyBtn.textContent = '✓';
      setTimeout(() => { copyBtn.textContent = '📋'; }, 1000);
    });
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete note';
    deleteBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      cursor: pointer;
      font-size: 14px;
    `;
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(originalIndex);
    });
    
    noteDiv.appendChild(noteText);
    noteDiv.appendChild(copyBtn);
    noteDiv.appendChild(deleteBtn);
    notesContainer.appendChild(noteDiv);
  });
  
  updateStats();
};

// ============================================
// EVENT LISTENERS
// ============================================

// Listen for storage changes (updates from background script)
chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY_NOTES]) {
    const currentFilter = searchInput ? searchInput.value : '';
    renderNotes(changes[STORAGE_KEY_NOTES].newValue || [], currentFilter);
  }
});

// Load notes on popup open
chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
  renderNotes(res[STORAGE_KEY_NOTES] || [], '');
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

// Search input handler (ENHANCEMENT 2)
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
      const notes = res[STORAGE_KEY_NOTES] || [];
      renderNotes(notes, e.target.value);
    });
  });
}

// Export button handler (ENHANCEMENT 3)
if (exportBtn) {
  exportBtn.addEventListener('click', exportNotes);
}

// Import button handler (ENHANCEMENT 3)
if (importBtn) {
  importBtn.addEventListener('click', importNotes);
}

// Input stats on typing (ENHANCEMENT 4)
noteInput.addEventListener('input', updateInputStats);

// ============================================
// INITIALIZATION
// ============================================

// Initial stats load
updateStats();
updateInputStats();

// Log total note count (original functionality)
const updateNoteCount = () => {
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const count = (res[STORAGE_KEY_NOTES] || []).length;
    console.log(`📝 You have ${count} note(s)`);
  });
};
updateNoteCount();

console.log("✨ Enhanced Notepad popup loaded with all features!");