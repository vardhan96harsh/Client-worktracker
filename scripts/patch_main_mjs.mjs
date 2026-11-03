import fs from "fs";

const file = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/main.mjs";
let content = fs.readFileSync(file, "utf8");

const oldBlock = `function createOrShowPausePopupWindow(alertData) {
  // 🔔 1. Show native Windows OS notification (Action Center banner)
  try {
    if (Notification && Notification.isSupported()) {
      const first = Array.isArray(alertData?.alerts) ? alertData.alerts[0] : null;
      const count = Array.isArray(alertData?.alerts) ? alertData.alerts.length : 1;
      const title = first?.employeeName
        ? \`⚠️ Session Paused • \${first.employeeName}\${count > 1 ? \` (+\${count - 1} more)\` : ""}\`
        : "⚠️ Employee Session Paused";
      const body = first?.pausedMinutes
        ? \`Paused for \${first.pausedMinutes}m on \${first.projectName || "General Task"}\`
        : "An employee session has been paused for 10+ minutes.";

      const notif = new Notification({
        title,
        body,
        icon: getAppIcon(),
        silent: false,
      });
      notif.on("click", () => {
        showMainWindow();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("navigate:tab", "dailyReport");
        }
      });
      notif.show();
    }
  } catch (notifErr) {
    console.warn("Native Notification error:", notifErr);
  }

  // 🔔 2. Also show floating desktop card
  const width = 390;
  const height = 180;
  const pos = getPausePopupPosition(width, height);`;

const newBlock = `function createOrShowPausePopupWindow(alertData) {
  // Ensure the overlay window yields so only ONE popup window exists in the bottom right
  if (overlayWindow && !overlayWindow.isDestroyed() && overlayWindow.isVisible()) {
    overlayWindow.hide();
  }

  // 🔔 ONLY ONE popup in bottom right: clean floating desktop card (NO duplicate OS banner)
  const width = 390;
  const height = 180;
  const pos = getPausePopupPosition(width, height);`;

const normalize = (s) => s.replace(/\r\n/g, "\n");
if (normalize(content).includes(normalize(oldBlock))) {
  // Replace normalizing line breaks
  const isCRLF = content.includes("\r\n");
  const normalizedContent = normalize(content);
  const replaced = normalizedContent.replace(normalize(oldBlock), normalize(newBlock));
  fs.writeFileSync(file, isCRLF ? replaced.replace(/\n/g, "\r\n") : replaced, "utf8");
  console.log("Successfully patched main.mjs (removed duplicate OS notification)");
} else {
  console.error("Target block not found in main.mjs!");
  process.exit(1);
}

// Also update closePausePopupWindow to restore overlay if main window is minimized
const oldClose = `function closePausePopupWindow() {
  if (pausePopupHideTimeout) {
    clearTimeout(pausePopupHideTimeout);
    pausePopupHideTimeout = null;
  }
  if (pausePopupWindow && !pausePopupWindow.isDestroyed()) {
    pausePopupWindow.hide();
  }
}`;

const newClose = `function closePausePopupWindow() {
  if (pausePopupHideTimeout) {
    clearTimeout(pausePopupHideTimeout);
    pausePopupHideTimeout = null;
  }
  if (pausePopupWindow && !pausePopupWindow.isDestroyed()) {
    pausePopupWindow.hide();
  }
  // Restore overlay widget if mainWindow is minimized and overlay is enabled
  if (mainWindow && (!mainWindow.isVisible() || mainWindow.isMinimized())) {
    if ((isTimerRunning || isAdminRole(userRole)) && overlayAllowed) {
      const ow = createOverlayWindow();
      if (ow && !ow.isDestroyed()) ow.showInactive();
    }
  }
}`;

content = fs.readFileSync(file, "utf8");
if (normalize(content).includes(normalize(oldClose))) {
  const isCRLF = content.includes("\r\n");
  const normalizedContent = normalize(content);
  const replaced = normalizedContent.replace(normalize(oldClose), normalize(newClose));
  fs.writeFileSync(file, isCRLF ? replaced.replace(/\n/g, "\r\n") : replaced, "utf8");
  console.log("Successfully patched closePausePopupWindow in main.mjs");
}

