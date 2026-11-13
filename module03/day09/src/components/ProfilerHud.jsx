import React, { useState, useSyncExternalStore } from 'react';
import { subscribe, getLogs, clearLogs } from '../telemetry.js';

/**
 * ProfilerHud - On-screen Diagnostics & Profiler HUD.
 *
 * Implements Exercise 5 & 6 tooling:
 * - Displays commits captured by React.Profiler
 * - Shows actualDuration vs baseDuration for each commit
 * - Allows switching between "Unoptimized" and "Optimized" mode
 * - Provides live verification metrics for PROFILE.md
 */
export default function ProfilerHud({
  profilerLogs: propsLogs,
  onClearLogs,
  useMemoization,
  onToggleMemoization,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const storeLogs = useSyncExternalStore(subscribe, getLogs);
  const profilerLogs = propsLogs || storeLogs;
  const handleClear = onClearLogs || clearLogs;

  // Compute average duration of 'update' commits
  const updateCommits = profilerLogs.filter((l) => l.phase === 'update');
  const avgDuration =
    updateCommits.length > 0
      ? (
          updateCommits.reduce((acc, curr) => acc + curr.actualDuration, 0) /
          updateCommits.length
        ).toFixed(2)
      : '0.00';

  return (
    <div className={`profiler-hud-container ${isOpen ? 'open' : 'minimized'}`}>
      <button
        type="button"
        className="profiler-hud-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        title="Toggle React Profiler Real-Time Telemetry HUD"
      >
        📊 React Profiler Telemetry ({profilerLogs.length} commits)
      </button>

      {isOpen && (
        <div className="profiler-hud-body">
          <div className="profiler-hud-header">
            <h4>React.Profiler Real-Time Telemetry</h4>
            <div className="profiler-hud-controls">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useMemoization}
                  onChange={onToggleMemoization}
                />
                <span className="toggle-text">
                  {useMemoization ? '⚡ Optimized (React.memo Active)' : '⚠️ Unoptimized (Full Re-render)'}
                </span>
              </label>

              <button
                type="button"
                className="btn-hud-clear"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="profiler-stats-bar">
            <div className="stat-pill">
              <span className="stat-label">Total Commits:</span>
              <span className="stat-val">{profilerLogs.length}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Update Commits:</span>
              <span className="stat-val">{updateCommits.length}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Avg Update Duration:</span>
              <span className="stat-val stat-highlight">{avgDuration} ms</span>
            </div>
          </div>

          <p className="profiler-hud-tip">
            <strong>Exercise 5 & 6 Instructions:</strong> Click "+ Add to Order" on three dishes.
            Compare the <code>actualDuration</code> with Optimization ON vs OFF.
          </p>

          <div className="profiler-table-wrapper">
            <table className="profiler-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Component / ID</th>
                  <th>Phase</th>
                  <th>Actual Duration</th>
                  <th>Base Duration</th>
                </tr>
              </thead>
              <tbody>
                {profilerLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">
                      No renders captured yet. Interact with the menu or cart!
                    </td>
                  </tr>
                ) : (
                  profilerLogs.slice(-8).map((log, index) => (
                    <tr key={index} className={log.phase === 'mount' ? 'row-mount' : 'row-update'}>
                      <td>{profilerLogs.length - index}</td>
                      <td><code>{log.id}</code></td>
                      <td>
                        <span className={`phase-badge ${log.phase}`}>
                          {log.phase}
                        </span>
                      </td>
                      <td className="duration-cell">
                        {log.actualDuration.toFixed(2)} ms
                      </td>
                      <td className="duration-cell">
                        {log.baseDuration.toFixed(2)} ms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
