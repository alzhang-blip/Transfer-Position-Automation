import { getAccountType, truncateAccount } from '../utils/validation';
import { offsetAccount } from '../data/mockData';

export default function BPSSimulation({ task }) {
  if (!task) return null;

  const srcType = getAccountType(task.sourceAccount);
  const destType = getAccountType(task.destAccount);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">
        BPS Entry Simulation
        <span className="ml-2 text-xs font-normal text-slate-500">
          ({task.positions.length} {task.positions.length === 1 ? 'entry pair' : 'entry pairs'})
        </span>
      </h3>

      {task.positions.map((pos, idx) => (
        <div key={pos.symbol} className="space-y-3">
          {task.positions.length > 1 && (
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Position {idx + 1}: {pos.symbol} — {pos.quantity.toLocaleString()} shares ({pos.currency})
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-red-800/50 rounded-lg overflow-hidden">
              <div className="bg-red-900/20 px-4 py-2.5 border-b border-red-800/50">
                <h4 className="text-xs font-bold text-red-400">DW — Withdrawal (Source)</h4>
              </div>
              <div className="p-4 space-y-3">
                <Row label="Entry Type" value="DW" />
                <Row label="Account" value={truncateAccount(task.sourceAccount)} mono />
                <Row label="Account Type" value={srcType} />
                <Row label="Account Holder" value={task.sourceName} />
                <Row label="Symbol" value={pos.symbol} mono />
                <Row label="Quantity" value={pos.quantity.toLocaleString()} mono />
                <Row label="Currency" value={pos.currency} />
                <div className="border-t border-red-800/30 pt-3">
                  <Row label="Offset Account" value={offsetAccount} mono highlight />
                </div>
              </div>
            </div>

            <div className="border border-emerald-800/50 rounded-lg overflow-hidden">
              <div className="bg-emerald-900/20 px-4 py-2.5 border-b border-emerald-800/50">
                <h4 className="text-xs font-bold text-emerald-400">DC — Contribution (Destination)</h4>
              </div>
              <div className="p-4 space-y-3">
                <Row label="Entry Type" value="DC" />
                <Row label="Account" value={truncateAccount(task.destAccount)} mono />
                <Row label="Account Type" value={destType} />
                <Row label="Account Holder" value={task.destName} />
                <Row label="Symbol" value={pos.symbol} mono />
                <Row label="Quantity" value={pos.quantity.toLocaleString()} mono />
                <Row label="Currency" value={pos.currency} />
                <div className="border-t border-emerald-800/30 pt-3">
                  <Row label="Offset Account" value={offsetAccount} mono highlight />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="p-3 rounded-lg bg-[#0d1117] border border-[#2d333b]">
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Internal offset account <span className="font-mono font-medium text-slate-400">{offsetAccount}</span> is used to balance each DW/DC pair.
          All {task.positions.length} entry {task.positions.length === 1 ? 'pair' : 'pairs'} must be submitted together as a matched set in BPS.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, mono, highlight }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500">{label}</span>
      <span
        className={`font-medium ${mono ? 'font-mono' : ''} ${
          highlight ? 'text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded' : 'text-slate-300'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
