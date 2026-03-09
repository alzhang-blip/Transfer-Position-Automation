import { useTaskContext } from './context/TaskContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskTable from './components/TaskTable';
import AgentProcessingView from './components/AgentProcessingView';
import InternalLog from './components/InternalLog';

function App() {
  const { state } = useTaskContext();

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-slate-200">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 bg-[#161b22]">
          {state.view === 'lead' && (
            <div className="flex-1 flex flex-col bg-[#161b22] m-4 rounded-xl overflow-hidden border border-[#2d333b]">
              <div className="p-6 border-b border-[#2d333b]">
                <h2 className="text-lg font-semibold text-white">Workload Management</h2>
                <p className="text-sm text-slate-500 mt-1">Daily Transfer Positions Report — triage and assign tasks to agents.</p>
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
