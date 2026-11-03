import fs from "fs";
import path from "path";

const distDir = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/dist";
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  console.log("Dist files:", files);
  for (const f of files) {
    const full = path.join(distDir, f);
    const stat = fs.statSync(full);
    console.log(`- ${f} (${(stat.size / 1024 / 1024).toFixed(2)} MB, mtime: ${stat.mtime.toISOString()})`);
  }
} else {
  console.log("Dist dir does not exist");
}

