import fs from "fs";

const exePath = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/electron/dist/Work Tracker Setup 2026.11.3.exe";
const stat = fs.statSync(exePath);
console.log("File exists:", fs.existsSync(exePath));
console.log("File size in bytes:", stat.size);

// Read first 256 bytes to check MZ PE header
const fd = fs.openSync(exePath, "r");
const buf = Buffer.alloc(256);
fs.readSync(fd, buf, 0, 256, 0);
fs.closeSync(fd);

const magic = buf.toString("ascii", 0, 2);
console.log("PE Magic Header:", magic); // Expect 'MZ'
if (magic === "MZ") {
  console.log("Valid Windows Executable binary confirmed!");
}

