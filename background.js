import { 
  STORAGE_KEY_NOTES, 
  MENU_ID_SELECTION, 
  MENU_ID_URL, 
  MENU_ID_LINK 
} from './consts.js';

// ============================================
// HELPER FUNCTION: Get Timestamp
// ============================================

// Get formatted timestamp for notes
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString(); // Returns: "5/3/2026, 2:30:45 PM"
};

// Alternative: Custom timestamp format (optional)
const getCustomTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ============================================
// CREATE CONTEXT MENUS
// ============================================

// Create context menus when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Menu for selected text
  chrome.contextMenus.create({
    id: MENU_ID_SELECTION,
    title: "📝 Save selected text to Notepad",
    contexts: ["selection"]
  });
  
  // Menu for page URL (when right-clicking anywhere on page)
  chrome.contextMenus.create({
    id: MENU_ID_URL,
    title: "🔗 Save page URL to Notepad",
    contexts: ["page"]
  });
  
  // Menu for link URL (when right-clicking on a hyperlink)
  chrome.contextMenus.create({
    id: MENU_ID_LINK,
    title: "🔗 Save link URL to Notepad",
    contexts: ["link"]
  });
  
  console.log("✅ Context menus created!");
});

// ============================================
// HANDLE CONTEXT MENU CLICKS (WITH TIMESTAMPS)
// ============================================

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let noteText = "";
  const timestamp = getTimestamp(); // Get current timestamp
  
  switch (info.menuItemId) {
    case MENU_ID_SELECTION:
      // Save highlighted text with page title and timestamp
      noteText = `[${timestamp}] 📖 From "${tab.title}": ${info.selectionText}`;
      break;
      
    case MENU_ID_URL:
      // Save current page URL with timestamp
      noteText = `[${timestamp}] 🌐 ${tab.title}\n${info.pageUrl}`;
      break;
      
    case MENU_ID_LINK:
      // Save link URL with timestamp
      noteText = `[${timestamp}] 🔗 Link from "${tab.title}": ${info.linkUrl}`;
      break;
      
    default:
      return;
  }
  
  // Save the note to storage
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    notes.push(noteText);
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes }, () => {
      console.log("📝 Note saved:", noteText.substring(0, 100) + (noteText.length > 100 ? "..." : ""));
    });
  });
});

// ============================================
// OPTIONAL: Show notification on save (requires notifications permission)
// ============================================

// Uncomment this section if you add "notifications" to permissions in manifest.json
/*
const showNotification = (title, message) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon48.png",
    title: title,
    message: message,
    priority: 1
  });
};

// Modified version with notification
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let noteText = "";
  const timestamp = getTimestamp();
  let notificationMessage = "";
  
  switch (info.menuItemId) {
    case MENU_ID_SELECTION:
      noteText = `[${timestamp}] 📖 From "${tab.title}": ${info.selectionText}`;
      notificationMessage = `Saved: "${info.selectionText.substring(0, 50)}${info.selectionText.length > 50 ? '...' : ''}"`;
      break;
      
    case MENU_ID_URL:
      noteText = `[${timestamp}] 🌐 ${tab.title}\n${info.pageUrl}`;
      notificationMessage = `Saved: ${tab.title}`;
      break;
      
    case MENU_ID_LINK:
      noteText = `[${timestamp}] 🔗 Link from "${tab.title}": ${info.linkUrl}`;
      notificationMessage = `Saved link: ${info.linkUrl.substring(0, 50)}...`;
      break;
      
    default:
      return;
  }
  
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    notes.push(noteText);
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes }, () => {
      console.log("Note saved:", noteText);
      showNotification("Note Saved", notificationMessage);
    });
  });
});
*/

// ============================================
// OPTIONAL: Keyboard shortcut to open popup (add to manifest commands)
// ============================================

// If you add commands in manifest, handle them here:
/*
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-notepad") {
    // This will open the popup programmatically
    console.log("Opening notepad...");
  }
});
*/

// ============================================
// OPTIONAL: Handle extension update
// ============================================

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    console.log(`📦 Extension updated to version ${chrome.runtime.getManifest().version}`);
    
    // You could show a "What's New" page on update
    // chrome.tabs.create({ url: chrome.runtime.getURL("whatsnew.html") });
  }
  
  if (details.reason === "install") {
    console.log("🎉 Extension installed for first time!");
    
    // Add a welcome note on first install
    const welcomeNote = `[${getTimestamp()}] 🎉 Welcome to Notepad! Right-click any webpage and select "Save to Notepad" to get started.`;
    
    chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
      const notes = res[STORAGE_KEY_NOTES] || [];
      notes.push(welcomeNote);
      chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes });
    });
  }
});

// ============================================
// OPTIONAL: Keep-alive (uncomment if needed for long operations)
// ============================================

/*
const keepAlive = () => {
  setInterval(chrome.runtime.getPlatformInfo, 20 * 1000);
};
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
*/

// ============================================
// INITIALIZATION LOG
// ============================================

console.log("🚀 Background service worker started! Version:", chrome.runtime.getManifest().version);