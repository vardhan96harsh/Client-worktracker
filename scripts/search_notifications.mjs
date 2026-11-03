import fs from "fs";
import path from "path";

function findFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== "dist") {
        results = results.concat(findFiles(full, filter));
      }
    } else if (filter(full)) {
      results.push(full);
    }
  }
  return results;
}

const frontendFiles = findFiles("d:/Harsh/Current_Running_Project/workTracker/projecttrack/frontend/src", f => f.endsWith(".jsx") || f.endsWith(".js"));
console.log("Found frontend files:", frontendFiles.length);

for (const f of frontendFiles) {
  const content = fs.readFileSync(f, "utf8");
  const lines = content.split("\n");
  lines.forEach((l, idx) => {
    if (/(showNotification|new Notification|toast|overlay|show-overlay|notification-received)/i.test(l) && !l.includes("import ") && !l.trim().startsWith("//")) {
      console.log(`${path.basename(f)}:${idx+1}: ${l.trim().slice(0, 120)}`);
    }
  });
}

const electronFiles = findFiles("d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron", f => f.endsWith(".mjs") || f.endsWith(".js") || f.endsWith(".cjs"));
console.log("\nFound electron files:", electronFiles.length);
for (const f of electronFiles) {
  const content = fs.readFileSync(f, "utf8");
  const lines = content.split("\n");
  lines.forEach((l, idx) => {
    if (/(Notification|overlay|tray|toast)/i.test(l) && !l.includes("import ") && !l.trim().startsWith("//")) {
      console.log(`${path.basename(f)}:${idx+1}: ${l.trim().slice(0, 120)}`);
    }
  });
}

