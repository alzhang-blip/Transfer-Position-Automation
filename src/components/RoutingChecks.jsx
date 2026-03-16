import { useTaskContext } from '../context/TaskContext';
import { validateTransfer } from '../utils/validation';

export default function RoutingChecks({ task }) {
  const { state } = useTaskContext();

  if (!task) return null;

  const validation = validateTransfer(task, state.tasks);
  const routingChecks = validation.checks.filter((c) => c.routing);

  if (routingChecks.length === 0) return null;

  return (
    <div className="bg-[var(--bg-base)] rounded-lg border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-heading)]">Routing Checks</h3>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          validation.workflow === 'auto' ? 'bg-cyan-500/15 text-cyan-600' : 'bg-orange-500/15 text-orange-600'
        }`}>
          {validation.workflow === 'auto' ? 'AUTO' : 'MANUAL'}
        </span>
        <p className="text-[10px] text-[var(--text-muted)] ml-auto">
          All pass &rarr; automated &middot; Any failure &rarr; manual review
        </p>
      </div>
      <div className="p-4 space-y-2">
        {routingChecks.map((check) => (
          <div
            key={check.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border ${
              check.passed
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <input
              type="checkbox"
              checked={check.passed}
              disabled
              className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-emerald-600 bg-[var(--bg-base)]"
            />
            <span className={`text-xs leading-relaxed ${
              check.passed ? 'text-emerald-600' : 'text-red-600 font-medium'
            }`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
