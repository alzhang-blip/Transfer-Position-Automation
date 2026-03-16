import { useState, useMemo, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { getAccountType, truncateAccount } from '../utils/validation';
import { agents } from '../data/mockData';
import ValidationChecklist from './ValidationChecklist';
import RejectionPanel from './RejectionPanel';
import GiftingLodPanel from './GiftingLodPanel';

export default function AgentProcessingView() {
  const { state, dispatch } = useTaskContext();
  const task = state.tasks.find((t) => t.id === state.selectedTaskId);

  const [agentFilter, setAgentFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [sidebarTab, setSidebarTab] = useState('validation');
  const rejectionRef = useRef(null);

  const [workflowFilter, setWorkflowFilter] = useState('manual');

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

  const filterBar = (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-[#2d333b] bg-[#0d1117]">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Filters</span>
      <select
        value={workflowFilter}
        onChange={(e) => setWorkflowFilter(e.target.value)}
        className="text-xs bg-[#161b22] border border-[#2d333b] rounded-md px-2.5 py-1.5 text-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
      >
        <option value="">All Workflows</option>
        <option value="manual">Manual Review</option>
        <option value="auto">Automated</option>
      </select>
      <select
        value={agentFilter}
        onChange={(e) => setAgentFilter(e.target.value)}
        className="text-xs bg-[#161b22] border border-[#2d333b] rounded-md px-2.5 py-1.5 text-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
      >
        <option value="">All Agents</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <span className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 font-medium">
        Source: TFSA only (Phase 1)
      </span>
      <select
        value={destFilter}
        onChange={(e) => setDestFilter(e.target.value)}
        className="text-xs bg-[#161b22] border border-[#2d333b] rounded-md px-2.5 py-1.5 text-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
      >
        <option value="">All Dest Accounts</option>
        <option value="5">TFSA (5...)</option>
        <option value="7">RRSP (7...)</option>
        <option value="8">FHSA (8...)</option>
        <option value="2">Margin (2...)</option>
        <option value="4">Margin (4...)</option>
        <option value="3">Cash (3...)</option>
      </select>
      {(agentFilter || destFilter || workflowFilter !== 'manual') && (
        <button
          onClick={() => { setAgentFilter(''); setDestFilter(''); setWorkflowFilter('manual'); }}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          Clear
        </button>
      )}
      <span className="text-[10px] text-slate-500 ml-auto">{activeTasks.length} tasks</span>
    </div>
  );

  if (!task) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-[#2d333b] bg-[#0d1117]">
          <h2 className="text-lg font-semibold text-white">Request Processing</h2>
          <p className="text-sm text-slate-500 mt-1">Select a task from the list or the All Requests view.</p>
        </div>
        {filterBar}
        <div className="flex-1 flex">
          <div className="w-72 border-r border-[#2d333b] bg-[#0d1117] overflow-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Active Queue</h3>
              {activeTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => dispatch({ type: 'SELECT_TASK', taskId: t.id })}
                  className="w-full text-left p-3 rounded-lg mb-2 border border-[#2d333b] hover:border-emerald-700 hover:bg-emerald-900/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-emerald-400">{t.id}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      t.workflow === 'manual' ? 'bg-orange-900/40 text-orange-400' : 'bg-cyan-900/40 text-cyan-400'
                    }`}>
                      {t.workflow === 'manual' ? 'Manual' : 'Auto'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {t.positions.length === 1
                      ? `${t.positions[0].symbol} · ${t.positions[0].quantity} shares`
                      : `${t.positions.length} positions`
                    }
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {getAccountType(t.sourceAccount)} &rarr; {getAccountType(t.destAccount)}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-500">
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-[#2d333b] bg-[#0d1117] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SELECT_TASK', taskId: null })}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              &larr; Back
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{task.id}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.status === 'Active' ? 'bg-emerald-900/40 text-emerald-400'
                    : task.status === 'Pending' ? 'bg-yellow-900/40 text-yellow-400'
                    : task.status === 'Complete' ? 'bg-emerald-900/40 text-emerald-400'
                    : 'bg-red-900/40 text-red-400'
                }`}>
                  {task.status}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  task.workflow === 'auto'
                    ? 'bg-cyan-900/40 text-cyan-400'
                    : 'bg-orange-900/40 text-orange-400'
                }`}>
                  {task.workflow === 'auto' ? 'Auto' : 'Manual'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {posCount === 1
                  ? `${task.positions[0].symbol} · ${task.positions[0].quantity.toLocaleString()} shares`
                  : `${posCount} positions to transfer`
                }
              </p>
            </div>
          </div>
          <div />
        </div>
      </div>

      {filterBar}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="w-56 border-r border-[#2d333b] bg-[#0d1117] overflow-auto shrink-0">
          <div className="p-3">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Queue</h3>
            {activeTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => dispatch({ type: 'SELECT_TASK', taskId: t.id })}
                className={`w-full text-left p-2.5 rounded-lg mb-1.5 border transition-all text-xs ${
                  t.id === task.id
                    ? 'border-emerald-600 bg-emerald-900/20'
                    : 'border-[#2d333b] hover:border-slate-600 hover:bg-[#161b22]'
                }`}
              >
                <div className="font-mono font-medium text-slate-300">{t.id}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {t.positions.length === 1
                    ? `${t.positions[0].symbol} · ${getAccountType(t.sourceAccount)} → ${getAccountType(t.destAccount)}`
                    : `${t.positions.length} pos · ${getAccountType(t.sourceAccount)} → ${getAccountType(t.destAccount)}`
                  }
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Account Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <DetailCard label="Source Account" primary={truncateAccount(task.sourceAccount)} secondary={task.sourceName} badge={getAccountType(task.sourceAccount)} />
            <DetailCard label="Destination Account" primary={truncateAccount(task.destAccount)} secondary={task.destName} badge={getAccountType(task.destAccount)} alert={task.destStatus !== 'Approved' ? task.destStatus : null} />
          </div>

          {/* Positions Table */}
          <div className="bg-[#0d1117] rounded-lg border border-[#2d333b] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2d333b] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">
                Positions to Transfer
                <span className="ml-2 text-xs font-normal text-slate-500">({posCount} {posCount === 1 ? 'asset' : 'assets'})</span>
              </h3>
              {posCount > 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400 border border-purple-700/50 font-medium">
                  Multi-Asset Transfer
                </span>
              )}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[#161b22]">
                <tr className="text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Currency</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2">Asset Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2733]">
                {task.positions.map((pos, idx) => (
                  <tr key={pos.symbol} className="hover:bg-[#1e2733]/50">
                    <td className="px-4 py-2.5 text-xs text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-medium text-slate-200">{pos.symbol}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        pos.currency === 'USD' ? 'bg-blue-900/30 text-blue-400' : 'bg-[#1e2733] text-slate-400'
                      }`}>
                        {pos.currency}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-slate-300">{pos.quantity.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{pos.assetClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          {task.status !== 'Complete' && task.status !== 'Rejected' && (
            <div className="flex gap-3">
              <button
                onClick={() => setSidebarTab('reject')}
                className="px-4 py-2 text-xs font-medium rounded-md bg-red-900/30 text-red-400 border border-red-700/50 hover:bg-red-900/50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => dispatch({ type: 'COMPLETE_TASK', taskId: task.id })}
                className="px-4 py-2 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Approve
              </button>
            </div>
          )}

          <GiftingLodPanel task={task} />
        </div>

        <div className="w-96 border-l border-[#2d333b] bg-[#0d1117] shrink-0 flex flex-col">
          <div className="flex border-b border-[#2d333b] bg-[#0d1117] shrink-0">
            <button
              onClick={() => setSidebarTab('validation')}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all ${
                sidebarTab === 'validation'
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-900/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#161b22]'
              }`}
            >
              Validation
            </button>
            <button
              onClick={() => setSidebarTab('reject')}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all ${
                sidebarTab === 'reject'
                  ? 'text-red-400 border-b-2 border-red-500 bg-red-900/10'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#161b22]'
              }`}
            >
              Reject / Actions
            </button>
          </div>
          <div ref={rejectionRef} className="flex-1 overflow-auto p-5">
            {sidebarTab === 'validation' && <ValidationChecklist task={task} />}
            {sidebarTab === 'reject' && <RejectionPanel task={task} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, primary, secondary, badge, alert }) {
  return (
    <div className="bg-[#0d1117] rounded-lg border border-[#2d333b] p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-white">{primary}</span>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2733] text-slate-400 font-medium">{badge}</span>
        )}
        {alert && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-400 font-bold">{alert}</span>
        )}
      </div>
      {secondary && <div className="text-xs text-slate-500 mt-1">{secondary}</div>}
    </div>
  );
}
