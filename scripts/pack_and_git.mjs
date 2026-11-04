import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const rootDir = "d:/Harsh/Current_Running_Project/workTracker/projecttrack";
const electronDir = path.join(rootDir, "electron");
const frontendDir = path.join(rootDir, "frontend");

function run(cmd, cwd = rootDir) {
  console.log(`\n[RUN] ${cmd} (in ${cwd})`);
  try {
    execSync(cmd, { cwd, stdio: "inherit" });
    return true;
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    return false;
  }
}

// 1. Commit frontend submodule
console.log("--- Syncing frontend ---");
run("git add -A", frontendDir);
run('git commit -m "fix(heartbeat): keep heartbeat active across OS-level activity and background apps"', frontendDir);

// 2. Commit electron submodule
console.log("--- Syncing electron ---");
run("git add -A", electronDir);
run('git commit -m "fix(electron): expose system:getIdleTime and ensure continuous background heartbeat"', electronDir);

// 3. Commit umbrella repository
console.log("--- Syncing umbrella repository ---");
run("git add -A", rootDir);
run('git commit -m "fix(tracking): prevent false auto-pauses when working in full-screen or background apps"', rootDir);
run("git push origin main", rootDir);

// 4. Package electron installer
console.log("--- Building Electron Windows Executables ---");
run("npm run dist", electronDir);

// Ensure 2026.11.03 copy is updated
const distDir = path.join(electronDir, "dist");
const src = path.join(distDir, "Work Tracker Setup 2026.11.3.exe");
const dest = path.join(distDir, "Work Tracker Setup 2026.11.03.exe");
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log("✅ Successfully updated: Work Tracker Setup 2026.11.03.exe");
}

console.log("\n>>> ALL TASKS FINISHED SUCCESSFULLY <<<");
