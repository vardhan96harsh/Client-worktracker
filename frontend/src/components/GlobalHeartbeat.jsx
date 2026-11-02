import { useEffect, useRef } from "react";
import { api } from "../api";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function GlobalHeartbeat({ auth }) {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!auth?.token) return;

    // Track user interaction to detect if user has walked away
    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "focus"];
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    const sendHeartbeat = async () => {
      try {
        // If user has had zero activity for > 15 minutes, do not send heartbeat
        // This allows backend auto-stop cron to cleanly auto-pause abandoned sessions
        const idleMs = Date.now() - lastActivityRef.current;
        if (idleMs > IDLE_TIMEOUT_MS) {
          return;
        }

        await api("/api/work-sessions/heartbeat", {
          method: "POST",
          token: auth.token,
        });
      } catch (err) {
        if (err?.status === 401 || err?.response?.status === 401) {
          console.warn("Heartbeat skipped: token expired or unauthorized");
          return;
        }
        console.error("Heartbeat failed:", err.message);
      }
    };

    // Send immediately after component starts
    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, 30000);

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
    };
  }, [auth?.token]);

  return null;
}
