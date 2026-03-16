import { useTaskContext } from '../context/TaskContext';

export default function InternalLog() {
  const { state } = useTaskContext();

  const sortedLog = [...state.internalLog].reverse();

  const rejectedTasks = state.tasks.filter((t) => t.status === 'Rejected');

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b border-[#2d333b] bg-[#0d1117]">
        <h2 className="text-lg font-semibold text-white">Internal Log & Reconciliation</h2>
        <p className="text-sm text-slate-500 mt-1">MF/GIC/PM sheet entries and rejection audit trail.</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Sheet Log Entries</h3>
          {sortedLog.length === 0 ? (
            <div className="text-sm text-slate-500 p-8 text-center border border-dashed border-[#2d333b] rounded-lg">
              No entries logged yet. Use "Log to Sheet" from the Request Processing view.
            </div>
          ) : (
            <div className="border border-[#2d333b] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#0d1117]">
                  <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Task ID</th>
                    <th className="px-4 py-3">Sheet</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2733]">
                  {sortedLog.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[#1e2733]/50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-emerald-400">{entry.taskId}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 border border-blue-700/50 font-medium">
                          {entry.sheet}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{entry.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-200 mb-3">
            Rejection Audit Trail
            <span className="ml-2 text-xs font-normal text-slate-500">({rejectedTasks.length} tasks)</span>
          </h3>
          {rejectedTasks.length === 0 ? (
            <div className="text-sm text-slate-500 p-8 text-center border border-dashed border-[#2d333b] rounded-lg">
              No rejected tasks.
            </div>
          ) : (
            <div className="space-y-2">
              {rejectedTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-4 rounded-lg border border-red-800/50 bg-red-900/20">
                  <div className="font-mono text-xs font-semibold text-red-400 whitespace-nowrap">{task.id}</div>
                  <div className="flex-1">
                    <p className="text-xs text-red-300 font-medium">{task.rejectionReason}</p>
                    <p className="text-[10px] text-red-500/80 mt-1">
                      {task.positions.map((p) => p.symbol).join(', ')} &middot; {task.positions.length} {task.positions.length === 1 ? 'position' : 'positions'} &middot; {task.sourceName} &rarr; {task.destName}
                    </p>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    task.showOnMyQuestrade ? 'bg-emerald-900/30 text-emerald-400' : 'bg-[#1e2733] text-slate-500'
                  }`}>
                    {task.showOnMyQuestrade ? 'Visible on MQ' : 'Hidden from MQ'}
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
