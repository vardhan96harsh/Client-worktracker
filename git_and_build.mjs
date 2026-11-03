// projecttrack/git_and_build.mjs
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function run(cmd, cwd = __dirname) {
  console.log(`\n========================================`);
  console.log(`[RUN] ${cmd} (in ${cwd})`);
  console.log(`========================================`);
  try {
    const out = execSync(cmd, { cwd, encoding: "utf8", stdio: "inherit" });
    return { ok: true, out };
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    return { ok: false, error: err.message };
  }
}

console.log(">>> STARTING WORK TRACKER BUILD & GIT PUSH AUTOMATION <<<");

const frontendDir = path.join(__dirname, "frontend");
const electronDir = path.join(__dirname, "electron");
const backendDir = path.join(__dirname, "backend");

// 1. Build Production Frontend
console.log("\n--- STEP 1: Building Production Frontend Bundle ---");
run("npm run build", frontendDir);

// 2. Build Electron Windows Executables
console.log("\n--- STEP 2: Packaging Electron Windows Executable ---");
run("npm run dist", electronDir);

// 3. Sync Backend Submodule
console.log("\n--- STEP 3: Syncing Backend Submodule ---");
run("git add -A", backendDir);
run('git commit -m "feat(sync): clock skew compensation, anti-tamper validation, and clean time calculations"', backendDir);
run("git push origin main", backendDir);

// 4. Sync Electron Submodule
console.log("\n--- STEP 4: Syncing Electron Submodule ---");
run("git add -A", electronDir);
run('git commit -m "feat(electron): bump version 2026.11.03 and bundle updated frontend distribution"', electronDir);
run("git push -u origin main", electronDir);

// 5. Sync Frontend Submodule
console.log("\n--- STEP 5: Syncing Frontend Submodule ---");
run("git add -A", frontendDir);
run('git commit -m "feat(frontend): clock skew compensation, idle heartbeat, and multi-deliverable UI"', frontendDir);
run("git push origin main", frontendDir);

// 6. Sync Umbrella Full-WorkTracker Monorepo
console.log("\n--- STEP 6: Syncing Umbrella Monorepo ---");
run("git add -A", __dirname);
run('git commit -m "feat: complete update with time calculation hardening, clock sync, and new 2026.11.03 release"', __dirname);
run("git push origin main", __dirname);

console.log("\n>>> WORK TRACKER BUILD & PUSH COMPLETED SUCCESSFULLY <<<");
