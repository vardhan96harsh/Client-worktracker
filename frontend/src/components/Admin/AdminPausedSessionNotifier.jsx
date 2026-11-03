import React, { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../api.js";

// Gentle harmonious double tone alert chime
function playPauseAlertChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.12); // E5
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // Ignore audio permission restrictions
  }
}

/**
 * Headless Controller for Admin Paused Session Notifications.
 *
 * Requirements:
 * - NO IN-APP POPUP inside the app view (returns null).
 * - EXACTLY ONE popup in the bottom right corner of the screen (via Electron desktop popup window).
 * - STRICT DE-DUPLICATION: sessions already notified are never re-notified repeatedly.
 */
export default function AdminPausedSessionNotifier({ auth, onAlertCountChange }) {
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("wt_admin_pause_alerts_enabled");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const [soundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("wt_admin_pause_alerts_sound");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  // Track session IDs that have already triggered a notification to eliminate duplicate alerts
  const alreadyNotifiedIdsRef = useRef(new Set());
  const initialMountRef = useRef(true);

  // Sync state to localStorage & broadcast event
  useEffect(() => {
    const handleExternalToggle = (e) => {
      if (typeof e?.detail?.enabled === "boolean") {
        setIsEnabled(e.detail.enabled);
      }
    };
    window.addEventListener("wt:adminPauseAlertsChanged", handleExternalToggle);
    return () => window.removeEventListener("wt:adminPauseAlertsChanged", handleExternalToggle);
  }, []);

  // Trigger ONE external desktop popup in bottom right
  const triggerPopupNotification = useCallback(
    (activeAlerts) => {
      if (!activeAlerts || activeAlerts.length === 0) return;

      try {
        localStorage.setItem("wt_latest_pause_alerts", JSON.stringify(activeAlerts));
      } catch {}

      // In Electron: trigger the single dedicated bottom-right desktop popup window
      if (typeof window !== "undefined" && window.worktracker?.showPausePopup) {
        try {
          window.worktracker.showPausePopup({ alerts: activeAlerts });
          return;
        } catch (err) {
          console.warn("Failed to open desktop pause popup window:", err);
        }
      }

      // Browser fallback (only when running outside Electron as pure browser webapp)
      if (
        typeof window !== "undefined" &&
        !("worktracker" in window) &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const newest = activeAlerts[0];
          new Notification(`⚠️ Session Paused • ${newest.employeeName}`, {
            body: `⏱️ Paused: ${newest.pausedMinutes}m\n📁 Project: ${newest.projectName || "General"}`,
            icon: "/favicon.png",
            tag: `wt-single-pause-alert`, // Re-uses tag so only ONE notification exists
          });
        } catch {}
      }
    },
    []
  );

  // Poll backend for paused sessions >= 10m
  const fetchAlerts = useCallback(async () => {
    if (!auth?.token || !isEnabled) {
      if (onAlertCountChange) onAlertCountChange(0);
      return;
    }

    try {
      const res = await api("/api/work-sessions/admin/paused-alerts?minMinutes=10", {
        token: auth.token,
      });

      if (res && Array.isArray(res.alerts)) {
        const activeAlerts = res.alerts;
        if (onAlertCountChange) {
          onAlertCountChange(activeAlerts.length);
        }

        // On first application mount, register existing alerts so admin isn't spammed with old alerts
        if (initialMountRef.current) {
          initialMountRef.current = false;
          activeAlerts.forEach((a) => alreadyNotifiedIdsRef.current.add(String(a.sessionId)));
          if (activeAlerts.length > 0) {
            triggerPopupNotification(activeAlerts);
          }
          return;
        }

        // Identify ONLY newly paused sessions that have not been notified yet
        const newlyPaused = activeAlerts.filter(
          (a) => !alreadyNotifiedIdsRef.current.has(String(a.sessionId))
        );

        if (newlyPaused.length > 0) {
          // Immediately mark them as notified so they will never repeat
          newlyPaused.forEach((a) => alreadyNotifiedIdsRef.current.add(String(a.sessionId)));

          if (soundEnabled) {
            playPauseAlertChime();
          }

          // Trigger the single bottom-right desktop popup
          triggerPopupNotification(activeAlerts);
        }

        // Clean up stale IDs for sessions that resumed or stopped
        const currentIds = new Set(activeAlerts.map((a) => String(a.sessionId)));
        for (const id of alreadyNotifiedIdsRef.current) {
          if (!currentIds.has(id)) {
            alreadyNotifiedIdsRef.current.delete(id);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch paused session alerts:", err?.message || err);
    }
  }, [auth?.token, isEnabled, soundEnabled, onAlertCountChange, triggerPopupNotification]);

  // Request browser notification permission once if outside Electron
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !("worktracker" in window) &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        Notification.requestPermission();
      } catch {}
    }
  }, []);

  // Listen for manual Test Alert event (e.g. from Preview/Test button)
  useEffect(() => {
    const handleTestTrigger = () => {
      const sampleAlert = {
        sessionId: "test-alert-" + Date.now(),
        employeeName: "Rishabh Thakur",
        employeeId: "EMP-104",
        designation: "Frontend Engineer",
        projectName: "Work Tracker Desktop",
        taskTitle: "Live Status Sync & Alerts",
        pausedMinutes: 95,
        lunchDeductedMinutes: 0,
        pausedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
      };
      if (soundEnabled) {
        playPauseAlertChime();
      }
      triggerPopupNotification([sampleAlert]);
    };

    window.addEventListener("wt:triggerTestAlert", handleTestTrigger);
    return () => window.removeEventListener("wt:triggerTestAlert", handleTestTrigger);
  }, [soundEnabled, triggerPopupNotification]);

  // Polling every 25 seconds
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 25000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // CRITICAL: DO NOT render any in-app notification popup.
  // There must be ONLY ONE popup in bottom right (the external desktop popup window).
  return null;
}
