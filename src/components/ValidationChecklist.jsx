import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { validateTransfer } from '../utils/validation';

export default function ValidationChecklist({ task }) {
  const { state } = useTaskContext();
  const [manualChecks, setManualChecks] = useState({});

  if (!task) return null;

  const validation = validateTransfer(task, state.tasks);

  const toggleCheck = (id) => {
    setManualChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const preChecks = validation.checks.filter((c) => !c.routing);
  const routingChecks = validation.checks.filter((c) => c.routing);

  const renderCheck = (check) => {
    const isManual = !check.auto;
    const passed = isManual ? manualChecks[check.id] ?? false : check.passed;

    return (
      <label
        key={check.id}
        className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
          passed === true
            ? 'border-emerald-700/50 bg-emerald-900/20'
            : passed === false && check.auto
            ? 'border-red-700/50 bg-red-900/20'
            : 'border-[#2d333b] bg-[#161b22] hover:border-slate-600'
        }`}
      >
        <input
          type="checkbox"
          checked={passed === true}
          onChange={() => isManual && toggleCheck(check.id)}
          disabled={check.auto}
          className="mt-0.5 h-4 w-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-[#0d1117]"
        />
        <span className={`text-xs leading-relaxed ${passed === true ? 'text-emerald-400' : passed === false && check.auto ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
          {check.label}
        </span>
      </label>
    );
  };

  return (
    <div className="space-y-4">
      {routingChecks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Routing Checks</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              validation.workflow === 'auto' ? 'bg-cyan-900/40 text-cyan-400' : 'bg-orange-900/40 text-orange-400'
            }`}>
              {validation.workflow === 'auto' ? 'AUTO' : 'MANUAL'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">
            If all pass &rarr; automated completion. Any failure &rarr; manual agent review.
          </p>
          <div className="space-y-2">
            {routingChecks.map(renderCheck)}
          </div>
        </div>
      )}

      <div className="border-t border-[#2d333b] pt-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Validation Checklist</h3>
        <div className="space-y-2">
          {preChecks.map(renderCheck)}
        </div>
      </div>
    </div>
  );
}
