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

  const renderCheck = (check) => {
    const isManual = !check.auto;
    const passed = isManual ? manualChecks[check.id] ?? false : check.passed;

    return (
      <label
        key={check.id}
        className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
          passed === true
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : passed === false && check.auto
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--text-faint)]'
        }`}
      >
        <input
          type="checkbox"
          checked={passed === true}
          onChange={() => isManual && toggleCheck(check.id)}
          disabled={check.auto}
          className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-emerald-600 focus:ring-emerald-500 bg-[var(--bg-base)]"
        />
        <span className={`text-xs leading-relaxed ${passed === true ? 'text-emerald-600' : passed === false && check.auto ? 'text-red-600 font-medium' : 'text-[var(--text-secondary)]'}`}>
          {check.label}
        </span>
      </label>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-heading)] mb-3">Validation Checklist</h3>
        <div className="space-y-2">
          {preChecks.map(renderCheck)}
        </div>
      </div>
    </div>
  );
}
