import { useTaskContext } from '../context/TaskContext';

export default function InternalLog() {
  const { state } = useTaskContext();

  const sortedLog = [...state.internalLog].reverse();
  const rejectedTasks = state.tasks.filter((t) => t.status === 'Rejected');

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-base)]">
        <h2 className="text-lg font-semibold text-[var(--text-heading)]">Internal Log & Reconciliation</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">MF/GIC/PM sheet entries and rejection audit trail.</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Sheet Log Entries</h3>
          {sortedLog.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)] p-8 text-center border border-dashed border-[var(--border)] rounded-lg">
              No entries logged yet. Use "Log to Sheet" from the Request Processing view.
            </div>
          ) : (
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-base)]">
                  <tr className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Task ID</th>
                    <th className="px-4 py-3">Sheet</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {sortedLog.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[var(--hover-bg)]">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{new Date(entry.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-emerald-600">{entry.taskId}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 border border-blue-500/30 font-medium">{entry.sheet}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{entry.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-3">
            Rejection Audit Trail
            <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">({rejectedTasks.length} tasks)</span>
          </h3>
          {rejectedTasks.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)] p-8 text-center border border-dashed border-[var(--border)] rounded-lg">
              No rejected tasks.
            </div>
          ) : (
            <div className="space-y-2">
              {rejectedTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="font-mono text-xs font-semibold text-red-600 whitespace-nowrap">{task.id}</div>
                  <div className="flex-1">
                    <p className="text-xs text-red-600 font-medium">{task.rejectionReason}</p>
                    <p className="text-[10px] text-red-500/70 mt-1">
                      {task.positions.map((p) => p.symbol).join(', ')} &middot; {task.positions.length} {task.positions.length === 1 ? 'position' : 'positions'} &middot; {task.sourceName} &rarr; {task.destName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
