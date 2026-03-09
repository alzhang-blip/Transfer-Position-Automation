import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

const subNavItems = [
  { id: 'lead', label: 'All Requests' },
  { id: 'agent', label: 'Request Processing' },
  { id: 'log', label: 'Sheet Log & Audit Trail' },
];

export default function Sidebar() {
  const { state, dispatch } = useTaskContext();
  const isPositionTransfersActive = ['lead', 'agent', 'log'].includes(state.view);
  const [expanded, setExpanded] = useState(isPositionTransfersActive);

  const toggleExpanded = () => {
    if (!expanded) {
      setExpanded(true);
      dispatch({ type: 'SET_VIEW', view: 'lead' });
    } else {
      setExpanded(false);
    }
  };

  return (
    <aside className="w-56 bg-[#0d1117] text-white flex flex-col shrink-0 border-r border-[#1e2733]">
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-0.5 mb-6">
          <SidebarLink label="Home" />
          <SidebarLink label="Clients" />
        </div>

        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-3 mb-2">Cases</p>
          <div className="space-y-0.5 ml-2 border-l border-[#1e2733] pl-2">
            <SidebarLink label="Transfers In" muted />
            <SidebarLink label="Deposits" muted />
            <SidebarLink label="Withdrawals" muted />
            <SidebarLink label="Internal Cash" muted />

            <button
              onClick={toggleExpanded}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all text-left whitespace-nowrap ${
                isPositionTransfersActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              Position Transfers
              <span className={`text-[10px] text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`}>
                &#9656;
              </span>
            </button>

            {expanded && (
              <div className="ml-3 border-l border-[#1e2733] pl-2 space-y-0.5 mt-0.5">
                {subNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => dispatch({ type: 'SET_VIEW', view: item.id })}
                    className={`w-full flex items-center px-3 py-1.5 rounded-md text-[11px] font-medium transition-all text-left whitespace-nowrap ${
                      state.view === item.id
                        ? 'text-white bg-[#1e2733]'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-[#161b22]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-[#1e2733]">
        <div className="space-y-1.5 text-[10px] text-slate-500">
          <div className="flex justify-between">
            <span>Active</span>
            <span className="font-mono text-slate-400">{state.tasks.filter((t) => t.status === 'Active').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="font-mono text-yellow-500">{state.tasks.filter((t) => t.status === 'Pending').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Complete</span>
            <span className="font-mono text-emerald-500">{state.tasks.filter((t) => t.status === 'Complete').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Rejected</span>
            <span className="font-mono text-red-400">{state.tasks.filter((t) => t.status === 'Rejected').length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ label, muted }) {
  return (
    <div className={`px-3 py-1.5 rounded-md text-xs ${muted ? 'text-slate-500' : 'text-slate-400'} cursor-default`}>
      {label}
    </div>
  );
}
