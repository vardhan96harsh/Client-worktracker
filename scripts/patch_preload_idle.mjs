import fs from "fs";

const file = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/preload.cjs";
let content = fs.readFileSync(file, "utf8");

const oldTarget = `  onUserActivity: (handler) => {
    const fn = () => handler && handler();
    ipcRenderer.on("system:user-activity", fn);
    return () => ipcRenderer.removeListener("system:user-activity", fn);
  },`;

const replacement = `  onUserActivity: (handler) => {
    const fn = () => handler && handler();
    ipcRenderer.on("system:user-activity", fn);
    return () => ipcRenderer.removeListener("system:user-activity", fn);
  },

  getIdleTime: () => ipcRenderer.invoke("system:getIdleTime"),`;

const normalize = (s) => s.replace(/\r\n/g, "\n");
if (normalize(content).includes(normalize(oldTarget))) {
  const isCRLF = content.includes("\r\n");
  const normalized = normalize(content);
  const replaced = normalized.replace(normalize(oldTarget), normalize(replacement));
  fs.writeFileSync(file, isCRLF ? replaced.replace(/\n/g, "\r\n") : replaced, "utf8");
  console.log("Successfully patched preload.cjs with getIdleTime");
} else {
  console.error("Target not found in preload.cjs");
  process.exit(1);
}

