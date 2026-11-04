import { performance } from "perf_hooks";

console.log("=== BENCHMARKING WORK TRACKER CORE LOGIC & MEMORY PROFILE ===");

// 1. Benchmark Timer Calculation Loop (Simulating 1 hour of 500ms ticks = 7,200 ticks)
function benchmarkTimerTicker() {
  const startMem = process.memoryUsage().heapUsed;
  const t0 = performance.now();

  let elapsedSeconds = 0;
  const startTime = Date.now() - 3600000; // 1 hour ago
  const offset = -150; // simulated clock skew

  for (let i = 0; i < 7200; i++) {
    const safeNow = Date.now() + offset;
    const diffMs = Math.max(0, safeNow - startTime);
    elapsedSeconds = Math.floor(diffMs / 1000);
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    const formatted = `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const t1 = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const memDeltaKB = ((endMem - startMem) / 1024).toFixed(2);
  const totalMs = (t1 - t0).toFixed(3);
  const avgMicrosecondsPerTick = ((t1 - t0) * 1000 / 7200).toFixed(3);

  console.log(`\n[Timer Ticker Benchmark]:`);
  console.log(`- Simulated ticks: 7,200 (equivalent to 1 FULL HOUR of continuous tracking)`);
  console.log(`- Total CPU time taken: ${totalMs} ms (out of 3,600,000 ms real time)`);
  console.log(`- Average time per tick: ${avgMicrosecondsPerTick} µs (microseconds)`);
  console.log(`- CPU Load percentage: ${((parseFloat(totalMs) / 3600000) * 100).toFixed(6)}%`);
  console.log(`- Memory delta: ${memDeltaKB} KB`);
}

// 2. Benchmark Idle Detection & System Check (Simulating 1 hour = 3,600 checks)
function benchmarkIdleCheck() {
  const startMem = process.memoryUsage().heapUsed;
  const t0 = performance.now();

  let wasIdle = false;
  let prevIdle = 0;
  for (let i = 0; i < 3600; i++) {
    const idleSeconds = (i % 600); // 0 to 599s
    if (!wasIdle && idleSeconds >= 300) wasIdle = true;
    if (wasIdle && idleSeconds < 10) wasIdle = false;
    const isUserActive = idleSeconds <= 1 || (idleSeconds < prevIdle && prevIdle > 2);
    prevIdle = idleSeconds;
  }

  const t1 = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const memDeltaKB = ((endMem - startMem) / 1024).toFixed(2);
  const totalMs = (t1 - t0).toFixed(3);

  console.log(`\n[Idle Detector Benchmark]:`);
  console.log(`- Simulated checks: 3,600 (equivalent to 1 FULL HOUR of 1-second system polling)`);
  console.log(`- Total CPU time taken: ${totalMs} ms`);
  console.log(`- CPU Load percentage: ${((parseFloat(totalMs) / 3600000) * 100).toFixed(6)}%`);
  console.log(`- Memory delta: ${memDeltaKB} KB`);
}

// 3. Benchmark Offline Queue Storage Serialization (Simulating 1,000 queue pushes)
function benchmarkOfflineQueue() {
  const startMem = process.memoryUsage().heapUsed;
  const t0 = performance.now();

  let queue = [];
  for (let i = 0; i < 1000; i++) {
    queue.push({
      type: "heartbeat",
      timestamp: Date.now() + i * 1000,
      data: { sessionId: "sess-123", activeMinutes: i }
    });
    if (queue.length > 500) queue.shift(); // FIFO bounds
    const serialized = JSON.stringify(queue);
  }

  const t1 = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const memDeltaKB = ((endMem - startMem) / 1024).toFixed(2);
  const totalMs = (t1 - t0).toFixed(3);

  console.log(`\n[Offline Queue Serialization Benchmark]:`);
  console.log(`- 1,000 queue operations`);
  console.log(`- Total time taken: ${totalMs} ms`);
  console.log(`- Memory delta: ${memDeltaKB} KB`);
}

benchmarkTimerTicker();
benchmarkIdleCheck();
benchmarkOfflineQueue();

