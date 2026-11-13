/**
 * Telemetry store for React.Profiler (Day 34 · Exercises 5 & 6)
 *
 * Storing commit logs outside the profiled component tree prevents
 * the dreaded infinite re-render loop where onRender triggers setState in App,
 * which re-renders the Profiler, which triggers onRender again.
 */

let logs = [];
const listeners = new Set();

export function recordCommit(entry) {
  logs = [...logs.slice(-29), entry];
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getLogs() {
  return logs;
}

export function clearLogs() {
  logs = [];
  listeners.forEach((fn) => fn());
}
