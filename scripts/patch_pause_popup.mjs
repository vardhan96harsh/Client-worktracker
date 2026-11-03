import fs from "fs";

const file = "d:/Harsh/Current_Running_Project/workTracker/projecttrack/frontend/src/components/Admin/PauseAlertPopup.jsx";
let content = fs.readFileSync(file, "utf8");

const oldCode = `  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("wt_latest_pause_alerts");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [
      {
        sessionId: "sample-1",
        employeeName: "Rishabh Thakur",
        employeeId: "EMP-104",
        designation: "Frontend Engineer",
        projectName: "Work Tracker Desktop",
        taskTitle: "Live Status Sync & Alerts",
        pausedMinutes: 95,
        lunchDeductedMinutes: 0,
        pausedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
      },
    ];
  });`;

const newCode = `  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("wt_latest_pause_alerts");
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [];
  });`;

const normalize = (s) => s.replace(/\r\n/g, "\n");
if (normalize(content).includes(normalize(oldCode))) {
  const isCRLF = content.includes("\r\n");
  let replaced = normalize(content).replace(normalize(oldCode), normalize(newCode));
  
  // Also remove lines 86-91 (initial duplicate chime)
  const oldChime = `  // Initial gentle chime on appearance
  useEffect(() => {
    if (soundEnabled) {
      playChime();
    }
  }, [soundEnabled]);`;
  replaced = replaced.replace(normalize(oldChime), "");

  // Also add guard: if (!currentAlert) return null;
  const oldGuard = `  const currentAlert = alerts[currentIndex] || alerts[0];
  const totalAlerts = alerts.length;`;
  const newGuard = `  const currentAlert = alerts[currentIndex] || alerts[0];
  const totalAlerts = alerts.length;

  if (!currentAlert) return null;`;
  replaced = replaced.replace(normalize(oldGuard), normalize(newGuard));

  fs.writeFileSync(file, isCRLF ? replaced.replace(/\n/g, "\r\n") : replaced, "utf8");
  console.log("Successfully patched PauseAlertPopup.jsx");
} else {
  console.error("Target not found in PauseAlertPopup.jsx");
  process.exit(1);
}

