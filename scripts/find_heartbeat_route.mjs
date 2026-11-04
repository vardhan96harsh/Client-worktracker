import fs from "fs";

const content = fs.readFileSync("d:/Harsh/Current_Running_Project/workTracker/projecttrack/backend/routes/workSessions.js", "utf8");
const lines = content.split("\n");
lines.forEach((l, i) => {
  if (l.includes("/heartbeat")) {
    console.log(lines.slice(i - 2, i + 35).join("\n"));
  }
});

