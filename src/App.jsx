import { useTaskContext } from './context/TaskContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskTable from './components/TaskTable';
import AgentProcessingView from './components/AgentProcessingView';
import InternalLog from './components/InternalLog';

function App() {
  const { state } = useTaskContext();

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-body)]">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 bg-[var(--bg-surface)]">
          {state.view === 'lead' && (
            <div className="flex-1 flex flex-col bg-[var(--bg-surface)] m-4 rounded-xl overflow-hidden border border-[var(--border)]">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-heading)]">Workload Management</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Daily Transfer Positions Report — triage and assign tasks to agents.</p>
              </div>
              <TaskTable />
            </div>
          )}
          {state.view === 'agent' && <AgentProcessingView />}
          {state.view === 'log' && <InternalLog />}
        </main>
      </div>
    </div>
  );
}

export default App;
