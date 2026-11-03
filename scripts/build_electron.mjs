import { execSync } from "child_process";
import path from "path";

const electronDir = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron";

console.log("Packaging electron (target: portable & nsis)...");
try {
  const out = execSync("npx electron-builder --win", {
    cwd: electronDir,
    stdio: "inherit"
  });
  console.log("Success packaging electron!");
} catch (err) {
  console.error("Build failed:", err.message);
  process.exit(1);
}

