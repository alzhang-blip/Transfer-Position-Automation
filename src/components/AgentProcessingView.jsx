import { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { getAccountType, truncateAccount } from '../utils/validation';
import { agents, rejectionReasons } from '../data/mockData';
import ValidationChecklist from './ValidationChecklist';
import RoutingChecks from './RoutingChecks';

export default function AgentProcessingView() {
  const { state, dispatch } = useTaskContext();
  const task = state.tasks.find((t) => t.id === state.selectedTaskId);

  const [agentFilter, setAgentFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [workflowFilter, setWorkflowFilter] = useState('manual');
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectStep, setRejectStep] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentVisible, setCommentVisible] = useState(false);

  const activeTasks = useMemo(() => {
    return state.tasks
      .filter((t) => {
        if (!workflowFilter) return true;
        if (workflowFilter === 'auto') return t.workflow === 'auto';
        return (t.status === 'Active' || t.status === 'Pending') && t.workflow === workflowFilter;
      })
      .filter((t) => !agentFilter || t.assignedTo === agentFilter)
      .filter((t) => !destFilter || t.destAccount.startsWith(destFilter));
  }, [state.tasks, agentFilter, destFilter, workflowFilter]);

  const sel = "text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[var(--text-body)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none";

  const filterBar = (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]">
      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Filters</span>
      <select value={workflowFilter} onChange={(e) => setWorkflowFilter(e.target.value)} className={sel}>
        <option value="">All Workflows</option>
        <option value="manual">Manual Review</option>
        <option value="auto">Automated</option>
      </select>
      <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className={sel}>
        <option value="">All Agents</option>
        {agents.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
      </select>
      <span className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-medium">
        Source: TFSA only (Phase 1)
      </span>
      <select value={destFilter} onChange={(e) => setDestFilter(e.target.value)} className={sel}>
        <option value="">All Dest Accounts</option>
        <option value="5">TFSA (5...)</option>
        <option value="7">RRSP (7...)</option>
        <option value="8">FHSA (8...)</option>
        <option value="2">Margin (2...)</option>
        <option value="4">Margin (4...)</option>
        <option value="3">Cash (3...)</option>
      </select>
      {(agentFilter || destFilter || workflowFilter !== 'manual') && (
        <button onClick={() => { setAgentFilter(''); setDestFilter(''); setWorkflowFilter('manual'); }}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] underline">Clear</button>
      )}
      <span className="text-[10px] text-[var(--text-muted)] ml-auto">{activeTasks.length} tasks</span>
    </div>
  );

  if (!task) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-base)]">
          <h2 className="text-lg font-semibold text-[var(--text-heading)]">Request Processing</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Select a task from the list or the All Requests view.</p>
        </div>
        {filterBar}
        <div className="flex-1 flex">
          <div className="w-72 border-r border-[var(--border)] bg-[var(--bg-base)] overflow-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Active Queue</h3>
              {activeTasks.map((t) => (
                <button key={t.id} onClick={() => dispatch({ type: 'SELECT_TASK', taskId: t.id })}
                  className="w-full text-left p-3 rounded-lg mb-2 border border-[var(--border)] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-emerald-600">{t.id}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      t.workflow === 'manual' ? 'bg-orange-500/15 text-orange-600' : 'bg-cyan-500/15 text-cyan-600'
                    }`}>{t.workflow === 'manual' ? 'Manual' : 'Auto'}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {t.positions.length === 1 ? `${t.positions[0].symbol} · ${t.positions[0].quantity} shares` : `${t.positions.length} positions`}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {getAccountType(t.sourceAccount)} &rarr; {getAccountType(t.destAccount)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
            <div className="text-center">
              <div className="text-4xl mb-2 opacity-30">&#9776;</div>
              <p className="text-sm">Select a task from the queue to begin processing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const posCount = task.positions.length;

  const handleReject = (reason) => {
    dispatch({ type: 'REJECT_TASK', taskId: task.id, reason });
    setRejectStep(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-base)] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => dispatch({ type: 'SELECT_TASK', taskId: null })}
              className="text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors">&larr; Back</button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--text-heading)]">{task.id}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.status === 'Active' ? 'bg-emerald-500/15 text-emerald-600'
                    : task.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-600'
                    : task.status === 'Complete' ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-red-500/15 text-red-600'
                }`}>{task.status}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  task.workflow === 'auto' ? 'bg-cyan-500/15 text-cyan-600' : 'bg-orange-500/15 text-orange-600'
                }`}>{task.workflow === 'auto' ? 'Auto' : 'Manual'}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {posCount === 1 ? `${task.positions[0].symbol} · ${task.positions[0].quantity.toLocaleString()} shares` : `${posCount} positions to transfer`}
              </p>
            </div>
          </div>
          <div />
        </div>
      </div>

      {filterBar}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="w-56 border-r border-[var(--border)] bg-[var(--bg-base)] overflow-auto shrink-0">
          <div className="p-3">
            <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Queue</h3>
            {activeTasks.map((t) => (
              <button key={t.id} onClick={() => dispatch({ type: 'SELECT_TASK', taskId: t.id })}
                className={`w-full text-left p-2.5 rounded-lg mb-1.5 border transition-all text-xs ${
                  t.id === task.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-[var(--border)] hover:border-[var(--text-faint)] hover:bg-[var(--bg-surface)]'
                }`}>
                <div className="font-mono font-medium text-[var(--text-body)]">{t.id}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {t.positions.length === 1 ? `${t.positions[0].symbol} · ${getAccountType(t.sourceAccount)} → ${getAccountType(t.destAccount)}`
                    : `${t.positions.length} pos · ${getAccountType(t.sourceAccount)} → ${getAccountType(t.destAccount)}`}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailCard label="Source Account" primary={truncateAccount(task.sourceAccount)} secondary={task.sourceName} badge={getAccountType(task.sourceAccount)} />
            <DetailCard label="Destination Account" primary={truncateAccount(task.destAccount)} secondary={task.destName} badge={getAccountType(task.destAccount)} alert={task.destStatus !== 'Approved' ? task.destStatus : null} />
          </div>

          <RoutingChecks task={task} />

          <div className="bg-[var(--bg-base)] rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-heading)]">
                Positions to Transfer
                <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">({posCount} {posCount === 1 ? 'asset' : 'assets'})</span>
              </h3>
              {posCount > 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 border border-purple-500/30 font-medium">Multi-Asset Transfer</span>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-surface)]">
                <tr className="text-left text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Currency</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2">Asset Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {task.positions.map((pos, idx) => (
                  <tr key={pos.symbol} className="hover:bg-[var(--hover-bg)]">
                    <td className="px-4 py-2.5 text-xs text-[var(--text-muted)]">{idx + 1}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-[var(--text-heading)]">{pos.symbol}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        pos.currency === 'USD' ? 'bg-blue-500/15 text-blue-600' : 'bg-[var(--badge-bg)] text-[var(--text-secondary)]'
                      }`}>{pos.currency}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-[var(--text-body)]">{pos.quantity.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)]">{pos.assetClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {task.workflow === 'manual' && (
            <div className="bg-[var(--bg-base)] rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text-heading)]">Agent Comments</h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Special instructions or additional notes for this request.</p>
              </div>
              <div className="p-4 space-y-3">
                {(task.comments || []).length > 0 && (
                  <div className="space-y-2 mb-2">
                    {(task.comments || []).map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[var(--text-muted)]">{new Date(c.timestamp).toLocaleString()}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            c.visibleToClient ? 'bg-blue-500/15 text-blue-600' : 'bg-[var(--badge-bg)] text-[var(--text-muted)]'
                          }`}>{c.visibleToClient ? 'Visible to client' : 'Internal only'}</span>
                        </div>
                        <p className="text-xs text-[var(--text-body)]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {task.status !== 'Complete' && task.status !== 'Rejected' && (
                  <>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-body)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={commentVisible} onChange={(e) => setCommentVisible(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-[var(--border)] text-blue-600 focus:ring-blue-500 bg-[var(--bg-base)]" />
                        <span className="text-[11px] text-[var(--text-secondary)]">Show on customer portal</span>
                      </label>
                      <button
                        onClick={() => {
                          const trimmed = commentText.trim();
                          if (!trimmed) return;
                          dispatch({ type: 'ADD_COMMENT', taskId: task.id, text: trimmed, visibleToClient: commentVisible });
                          setCommentText('');
                          setCommentVisible(false);
                        }}
                        disabled={!commentText.trim()}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        Add Comment
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {task.status !== 'Complete' && task.status !== 'Rejected' && (
            <div className="flex gap-3">
              <button onClick={() => setRejectStep('select')}
                className="px-4 py-2 text-xs font-medium rounded-md bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20 transition-colors">Reject</button>
              <button onClick={() => setConfirmAction({ type: 'approve', taskId: task.id })}
                className="px-4 py-2 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Approve</button>
            </div>
          )}

          {confirmAction && (
            <ConfirmModal action={confirmAction.type}
              onConfirm={() => { if (confirmAction.type === 'approve') dispatch({ type: 'COMPLETE_TASK', taskId: confirmAction.taskId }); setConfirmAction(null); }}
              onCancel={() => setConfirmAction(null)} />
          )}
        </div>

        <div className="w-96 border-l border-[var(--border)] bg-[var(--bg-base)] shrink-0 flex flex-col">
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-base)] shrink-0">
            <span className="text-xs font-medium text-emerald-600">Validation</span>
          </div>
          <div className="flex-1 overflow-auto p-5">
            <ValidationChecklist task={task} />
          </div>
        </div>
      </div>

      {rejectStep === 'select' && (
        <RejectReasonModal
          onSelect={(reason) => setRejectStep({ reason })}
          onCancel={() => setRejectStep(null)}
        />
      )}

      {rejectStep && rejectStep.reason && (
        <ConfirmRejectModal
          reason={rejectStep.reason}
          onConfirm={() => handleReject(rejectStep.reason)}
          onBack={() => setRejectStep('select')}
          onCancel={() => setRejectStep(null)}
        />
      )}
    </div>
  );
}

function RejectReasonModal({ onSelect, onCancel }) {
  const [showOther, setShowOther] = useState(false);
  const [customReason, setCustomReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-bg)]">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-1">Select Rejection Reason</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">Choose a reason for rejecting this transfer request.</p>

        <div className="space-y-1.5 mb-4">
          {rejectionReasons.map((reason) => (
            <button key={reason} onClick={() => onSelect(reason)}
              className="w-full text-left px-3 py-2.5 text-xs rounded-lg border border-red-500/30 text-red-600 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/40 transition-all">
              {reason}
            </button>
          ))}

          <button onClick={() => setShowOther((v) => !v)}
            className={`w-full text-left px-3 py-2.5 text-xs rounded-lg border transition-all ${
              showOther ? 'border-orange-500/40 text-orange-600 bg-orange-500/10' : 'border-red-500/30 text-red-600 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/40'
            }`}>
            Other...
          </button>

          {showOther && (
            <div className="space-y-2 pt-1">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom rejection reason..."
                rows={3}
                autoFocus
                className="w-full text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-body)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
              <button
                onClick={() => { const t = customReason.trim(); if (t) onSelect(t); }}
                disabled={!customReason.trim()}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Continue with Custom Reason
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--bg-base)] text-[var(--text-body)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRejectModal({ reason, onConfirm, onBack, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-bg)]">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-2">Confirm Rejection</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-2">Are you sure you want to reject this transfer request?</p>
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 mb-5">
          <p className="text-xs text-red-600 font-medium">{reason}</p>
        </div>
        <div className="flex justify-between">
          <button onClick={onBack}
            className="px-4 py-2 text-xs font-medium rounded-md text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors">&larr; Change Reason</button>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--bg-base)] text-[var(--text-body)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">Cancel</button>
            <button onClick={onConfirm}
              className="px-4 py-2 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ action, onConfirm, onCancel }) {
  const isApprove = action === 'approve';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-bg)]">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-2">{isApprove ? 'Confirm Approval' : 'Confirm Rejection'}</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-5">
          {isApprove ? 'Are you sure you want to approve this transfer request? This action cannot be undone.' : 'Are you sure you want to reject this transfer request? This action cannot be undone.'}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}
            className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--bg-base)] text-[var(--text-body)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">Cancel</button>
          <button onClick={onConfirm}
            className={`px-4 py-2 text-xs font-medium rounded-md text-white transition-colors ${isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {isApprove ? 'Yes, Approve' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, primary, secondary, badge, alert }) {
  return (
    <div className="bg-[var(--bg-base)] rounded-lg border border-[var(--border)] p-4">
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-[var(--text-heading)]">{primary}</span>
        {badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--text-secondary)] font-medium">{badge}</span>}
        {alert && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 font-bold">{alert}</span>}
      </div>
      {secondary && <div className="text-xs text-[var(--text-muted)] mt-1">{secondary}</div>}
    </div>
  );
}
