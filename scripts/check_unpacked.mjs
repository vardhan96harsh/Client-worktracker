import fs from "fs";
import path from "path";

const unpackedDir = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/dist/win-unpacked";
if (fs.existsSync(unpackedDir)) {
  const files = fs.readdirSync(unpackedDir);
  console.log("Unpacked files count:", files.length);
  const exe = path.join(unpackedDir, "Work Tracker.exe");
  if (fs.existsSync(exe)) {
    const stat = fs.statSync(exe);
    console.log("Found unpacked exe:", (stat.size / 1024 / 1024).toFixed(2), "MB");
  }
}

// Copy setup exe to both naming formats so user can find it by 2026.11.03 and 2026.11.3
const distDir = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/dist";
const srcSetup = path.join(distDir, "Work Tracker Setup 2026.11.3.exe");
const destSetup = path.join(distDir, "Work Tracker Setup 2026.11.03.exe");
if (fs.existsSync(srcSetup) && !fs.existsSync(destSetup)) {
  fs.copyFileSync(srcSetup, destSetup);
  console.log("Created copy: Work Tracker Setup 2026.11.03.exe");
}

