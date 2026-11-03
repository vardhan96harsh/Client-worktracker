import { execSync } from "child_process";

const cwd = "d:/Harsh/Current_Running_Project/workTracker/projecttrack";
execSync("git add scripts/ git_and_build.mjs", { cwd, stdio: "inherit" });
try {
  execSync('git commit -m "chore: add verification and build automation scripts"', { cwd, stdio: "inherit" });
} catch (e) {
  console.log("No new changes to commit");
}
execSync("git push origin main", { cwd, stdio: "inherit" });
console.log("Git push completed successfully!");
