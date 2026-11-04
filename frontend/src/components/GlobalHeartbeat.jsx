import { useEffect, useRef } from "react";
import { api } from "../api";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function GlobalHeartbeat({ auth }) {
  const lastActivityRef = useRef(Date.now());
  const isSystemIdleRef = useRef(false);

  useEffect(() => {
    if (!auth?.token) return;

    // Track user interaction across both the tracker window AND the entire Windows OS
    const onActivity = () => {
      lastActivityRef.current = Date.now();
      isSystemIdleRef.current = false;
    };

    // 1. DOM events when app window is focused
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "focus"];
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    // 2. OS-level events from Electron (fires when user is working in Storyline, Chrome, Word, etc.)
    const offUserActivity = window.worktracker?.onUserActivity?.(onActivity);
    const offSystemActive = window.worktracker?.onSystemActive?.(onActivity);
    const offSystemIdle = window.worktracker?.onSystemIdle?.(() => {
      isSystemIdleRef.current = true;
    });

    const sendHeartbeat = async () => {
      try {
        // In desktop Electron app: directly query Windows OS idle time
        if (typeof window !== "undefined" && window.worktracker?.getIdleTime) {
          try {
            const idleSec = await window.worktracker.getIdleTime();
            // If user touched mouse/keyboard anywhere in Windows in the last 15 minutes, keep active
            if (typeof idleSec === "number" && idleSec < 900) {
              lastActivityRef.current = Date.now();
              isSystemIdleRef.current = false;
            } else if (typeof idleSec === "number" && idleSec >= 900) {
              isSystemIdleRef.current = true;
            }
          } catch { }
        }

        // Only suppress heartbeat if user has been TRULY idle across the entire computer for > 15 minutes
        const idleMs = Date.now() - lastActivityRef.current;
        if (isSystemIdleRef.current && idleMs > IDLE_TIMEOUT_MS) {
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
      if (typeof offUserActivity === "function") offUserActivity();
      if (typeof offSystemActive === "function") offSystemActive();
      if (typeof offSystemIdle === "function") offSystemIdle();
    };
  }, [auth?.token]);

  return null;
}
