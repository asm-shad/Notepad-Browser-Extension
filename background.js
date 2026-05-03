import { 
  STORAGE_KEY_NOTES, 
  MENU_ID_SELECTION, 
  MENU_ID_URL, 
  MENU_ID_LINK 
} from './consts.js';

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
  
  console.log("Context menus created!");
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let noteText = "";
  
  switch (info.menuItemId) {
    case MENU_ID_SELECTION:
      // Save highlighted text with page title
      noteText = `📖 From "${tab.title}": ${info.selectionText}`;
      break;
      
    case MENU_ID_URL:
      // Save current page URL
      noteText = `🌐 ${tab.title}\n${info.pageUrl}`;
      break;
      
    case MENU_ID_LINK:
      // Save link URL
      noteText = `🔗 Link from "${tab.title}": ${info.linkUrl}`;
      break;
      
    default:
      return;
  }
  
  // Save the note to storage
  chrome.storage.local.get([STORAGE_KEY_NOTES], (res) => {
    const notes = res[STORAGE_KEY_NOTES] || [];
    notes.push(noteText);
    chrome.storage.local.set({ [STORAGE_KEY_NOTES]: notes }, () => {
      // Optional: Show notification that note was saved
      console.log("Note saved:", noteText);
    });
  });
});

// Optional: Log when extension starts
console.log("Background service worker started!");