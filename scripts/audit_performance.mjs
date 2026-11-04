import fs from "fs";
import path from "path";

const root = "d:/Harsh/Current_Running_Project/workTracker/projecttrack";

function getAllFiles(dir, filter) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== "node_modules" && f !== ".git" && f !== "dist" && f !== "frontend-dist") {
        files = files.concat(getAllFiles(full, filter));
      }
    } else if (filter(full)) {
      files.push(full);
    }
  }
  return files;
}

console.log("=== WORK TRACKER END-TO-END PERFORMANCE & SLOWNESS AUDIT ===");

const frontendFiles = getAllFiles(path.join(root, "frontend/src"), (f) => f.endsWith(".jsx") || f.endsWith(".js"));
const electronFiles = getAllFiles(path.join(root, "electron"), (f) => f.endsWith(".mjs") || f.endsWith(".cjs") || f.endsWith(".js"));

console.log(`\nScanning ${frontendFiles.length} frontend files and ${electronFiles.length} electron files...`);

// 1. Audit Intervals & Frequency
console.log("\n[1] AUDITING BACKGROUND INTERVALS & FREQUENCIES:");
let intervalsFound = [];
[...frontendFiles, ...electronFiles].forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (line.includes("setInterval(") && !line.trim().startsWith("//")) {
      intervalsFound.push({ file: path.relative(root, file), line: idx + 1, text: line.trim() });
    }
  });
});

intervalsFound.forEach((inv) => {
  console.log(`- ${inv.file}:${inv.line} -> ${inv.text}`);
});

// 2. Audit Potential Memory Leaks (Event Listeners without cleanup)
console.log("\n[2] AUDITING EVENT LISTENERS & CLEANUPS:");
let listenerIssues = [];
frontendFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const adds = (content.match(/addEventListener\(/g) || []).length;
  const removes = (content.match(/removeEventListener\(/g) || []).length;
  if (adds > removes && adds > 1) {
    listenerIssues.push({ file: path.relative(root, file), adds, removes });
  }
});
if (listenerIssues.length === 0) {
  console.log("✅ All window event listeners have matching cleanups or are passive.");
} else {
  listenerIssues.forEach((iss) => {
    console.log(`⚠️ ${iss.file}: ${iss.adds} addEventListener vs ${iss.removes} removeEventListener`);
  });
}

// 3. Audit LocalStorage / Disk I/O frequency
console.log("\n[3] AUDITING DISK / LOCALSTORAGE WRITE USAGE:");
let storageWrites = [];
frontendFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(/localStorage\.setItem\(/g) || [];
  if (matches.length > 0) {
    storageWrites.push({ file: path.relative(root, file), count: matches.length });
  }
});
storageWrites.forEach((sw) => {
  console.log(`- ${sw.file}: ${sw.count} setItem calls`);
});

// 4. Audit IPC broadcast rates in Electron
console.log("\n[4] AUDITING ELECTRON IPC CHANNELS & BROADCAST FREQUENCY:");
const mainMjs = fs.readFileSync(path.join(root, "electron/main.mjs"), "utf8");
const ipcSends = mainMjs.match(/webContents\.send\([^)]+\)/g) || [];
console.log(`Total IPC webContents.send calls found in main.mjs: ${ipcSends.length}`);
ipcSends.forEach((s) => console.log(`  * ${s}`));

