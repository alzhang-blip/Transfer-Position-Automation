import { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { agents } from '../data/mockData';
import { getAccountType, truncateAccount } from '../utils/validation';

export default function TaskTable() {
  const { state, dispatch } = useTaskContext();

  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    let result = [...state.tasks];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.sourceAccount.includes(q) ||
          t.destAccount.includes(q) ||
          t.positions.some((p) => p.symbol.toLowerCase().includes(q)) ||
          t.positions.some((p) => String(p.quantity).includes(q))
      );
    }

    if (dateFrom) result = result.filter((t) => t.requestDate >= dateFrom);
    if (dateTo) result = result.filter((t) => t.requestDate <= dateTo);
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);

    result.sort((a, b) =>
      sortDir === 'asc'
        ? a.requestDate.localeCompare(b.requestDate)
        : b.requestDate.localeCompare(a.requestDate)
    );

    return result;
  }, [state.tasks, search, dateFrom, dateTo, statusFilter, sortDir]);

  const handleAssign = (taskId, agentId) => {
    dispatch({ type: 'ASSIGN_TASK', taskId, agentId: agentId || null });
  };

  const openTask = (taskId) => {
    dispatch({ type: 'SELECT_TASK', taskId });
    dispatch({ type: 'SET_VIEW', view: 'agent' });
  };

  const hasFilters = search || dateFrom || dateTo || statusFilter;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">&#128269;</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Task ID, account, symbol, qty..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text-body)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Date</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-2 py-1.5 text-[var(--text-body)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-2 py-1.5 text-[var(--text-body)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-[var(--text-body)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Complete">Complete</option>
          <option value="Rejected">Rejected</option>
        </select>

        {hasFilters && (
          <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setStatusFilter(''); }}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] underline">Clear</button>
        )}

        <span className="text-[10px] text-[var(--text-muted)] ml-auto">{filtered.length} of {state.tasks.length} tasks</span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-base)] sticky top-0 z-10">
            <tr className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              <th className="px-4 py-3">Task ID</th>
              <th className="px-4 py-3 cursor-pointer select-none hover:text-[var(--text-body)]"
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}>
                Date {sortDir === 'asc' ? '▲' : '▼'}
              </th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Positions</th>
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assign To</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {filtered.map((task) => {
              const isSameLastName = task.sameLastName && !task.sameCX;
              const posCount = task.positions.length;

              return (
                <tr key={task.id} className={`transition-colors hover:bg-[var(--hover-bg)] ${isSameLastName ? 'bg-blue-500/10' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-body)]">{task.id}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{task.requestDate}</td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-mono text-xs text-[var(--text-body)]">{truncateAccount(task.sourceAccount)}</span>
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--text-secondary)] font-medium">{getAccountType(task.sourceAccount)}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{task.sourceName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-mono text-xs text-[var(--text-body)]">{truncateAccount(task.destAccount)}</span>
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--text-secondary)] font-medium">{getAccountType(task.destAccount)}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{task.destName}</div>
                  </td>
                  <td className="px-4 py-3">
                    {posCount === 1 ? (
                      <div>
                        <span className="font-mono text-xs font-medium text-[var(--text-body)]">{task.positions[0].symbol}</span>
                        <span className="text-xs text-[var(--text-muted)] ml-1.5">{task.positions[0].quantity.toLocaleString()} shares</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-medium text-[var(--text-body)]">{posCount} assets</span>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {task.positions.slice(0, 3).map((p) => p.symbol).join(', ')}
                          {posCount > 3 && ` +${posCount - 3}`}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      task.workflow === 'auto' ? 'bg-cyan-500/15 text-cyan-600' : 'bg-orange-500/15 text-orange-600'
                    }`} title={task.workflow === 'manual' && task.workflowReasons ? task.workflowReasons.map(r => r.label).join('\n') : ''}>
                      {task.workflow === 'auto' ? 'Auto' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.status === 'Active' ? 'bg-blue-500/15 text-blue-600'
                        : task.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-600'
                        : task.status === 'Complete' ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-red-500/15 text-red-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {task.workflow === 'auto' ? (
                      <span className="text-xs text-[var(--text-muted)]">System</span>
                    ) : (
                      <select value={task.assignedTo || ''} onChange={(e) => handleAssign(task.id, e.target.value)}
                        className="text-xs bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-2 py-1.5 text-[var(--text-body)] focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                        <option value="">Unassigned</option>
                        {agents.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openTask(task.id)} className="text-xs font-medium text-emerald-600 hover:text-emerald-500 hover:underline">Open</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
