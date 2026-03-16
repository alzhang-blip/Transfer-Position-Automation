import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { rejectionReasons } from '../data/mockData';

export default function RejectionPanel({ task }) {
  const { dispatch } = useTaskContext();
  const [pendingReason, setPendingReason] = useState(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customReason, setCustomReason] = useState('');

  if (!task || task.status === 'Complete' || task.status === 'Rejected') return null;

  const handleReject = (reason) => {
    dispatch({ type: 'REJECT_TASK', taskId: task.id, reason });
    setPendingReason(null);
    setShowOtherInput(false);
    setCustomReason('');
  };

  const handleOtherSubmit = () => {
    const trimmed = customReason.trim();
    if (trimmed) setPendingReason(trimmed);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Quick Actions</h3>
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">One-Click Rejection</p>
          {rejectionReasons.map((reason) => (
            <button key={reason} onClick={() => setPendingReason(reason)}
              className="w-full text-left px-3 py-2 text-xs rounded-lg border border-red-500/30 text-red-600 bg-red-500/10 hover:bg-red-500/15 hover:border-red-500/40 transition-all">
              {reason}
            </button>
          ))}
          <button onClick={() => setShowOtherInput((v) => !v)}
            className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition-all ${
              showOtherInput
                ? 'border-orange-500/40 text-orange-600 bg-orange-500/10'
                : 'border-red-500/30 text-red-600 bg-red-500/10 hover:bg-red-500/15 hover:border-red-500/40'
            }`}>
            Other...
          </button>
          {showOtherInput && (
            <div className="space-y-2 pt-1">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom rejection reason..."
                rows={3}
                className="w-full text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-body)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
              <button
                onClick={handleOtherSubmit}
                disabled={!customReason.trim()}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Reject with Custom Reason
              </button>
            </div>
          )}
        </div>
      </div>

      {pendingReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-bg)]">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-2">Confirm Rejection</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-2">Are you sure you want to reject this transfer request?</p>
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 mb-5">
              <p className="text-xs text-red-600 font-medium">{pendingReason}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setPendingReason(null)}
                className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--bg-base)] text-[var(--text-body)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">Cancel</button>
              <button onClick={() => handleReject(pendingReason)}
                className="px-4 py-2 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
