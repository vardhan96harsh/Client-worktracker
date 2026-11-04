import fs from "fs";

const file = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/main.mjs";
let content = fs.readFileSync(file, "utf8");

const oldTarget = `ipcMain.handle("config:get", async () => {`;
const replacement = `ipcMain.handle("system:getIdleTime", async () => {
  try {
    return powerMonitor.getSystemIdleTime();
  } catch {
    return 0;
  }
});

ipcMain.handle("config:get", async () => {`;

const normalize = (s) => s.replace(/\r\n/g, "\n");
if (normalize(content).includes(normalize(oldTarget))) {
  const isCRLF = content.includes("\r\n");
  const normalized = normalize(content);
  const replaced = normalized.replace(normalize(oldTarget), normalize(replacement));
  fs.writeFileSync(file, isCRLF ? replaced.replace(/\n/g, "\r\n") : replaced, "utf8");
  console.log("Successfully patched main.mjs with system:getIdleTime");
} else {
  console.error("Target not found in main.mjs");
  process.exit(1);
}

