import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { rejectionReasons } from '../data/mockData';

export default function RejectionPanel({ task }) {
  const { dispatch } = useTaskContext();
  const [showOnMQ, setShowOnMQ] = useState(true);

  if (!task || task.status === 'Complete' || task.status === 'Rejected') return null;

  const handleReject = (reason) => {
    dispatch({
      type: 'REJECT_TASK',
      taskId: task.id,
      reason,
      showOnMyQuestrade: showOnMQ,
    });
  };

  const handleLogToSheet = (sheet) => {
    dispatch({
      type: 'LOG_ENTRY',
      taskId: task.id,
      message: `Logged ${task.positions.map((p) => p.symbol).join(', ')} (${task.positions.length} position${task.positions.length > 1 ? 's' : ''}) transfer to ${sheet}`,
      sheet,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Quick Actions</h3>

        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-[#161b22] border border-[#2d333b]">
          <input
            type="checkbox"
            id="showOnMQ"
            checked={showOnMQ}
            onChange={(e) => setShowOnMQ(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-[#0d1117]"
          />
          <label htmlFor="showOnMQ" className="text-xs text-slate-400 cursor-pointer">
            Show on MyQuestrade
          </label>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">One-Click Rejection</p>
          {rejectionReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReject(reason)}
              className="w-full text-left px-3 py-2 text-xs rounded-lg border border-red-800/50 text-red-400 bg-red-900/20 hover:bg-red-900/30 hover:border-red-700 transition-all"
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-2">Log to Sheet</p>
        <div className="flex gap-2">
          {['MF Sheet', 'GIC Sheet', 'PM Sheet'].map((sheet) => (
            <button
              key={sheet}
              onClick={() => handleLogToSheet(sheet)}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-[#2d333b] bg-[#161b22] text-slate-400 hover:bg-[#1e2733] hover:border-slate-600 transition-all"
            >
              {sheet}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
