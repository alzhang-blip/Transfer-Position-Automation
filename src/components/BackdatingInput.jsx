import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function BackdatingInput({ task }) {
  const { dispatch } = useTaskContext();
  const [showBackdating, setShowBackdating] = useState(false);

  if (!task) return null;

  const handlePriceChange = (field, value) => {
    dispatch({
      type: 'UPDATE_TASK_FIELD',
      taskId: task.id,
      field,
      value: value ? parseFloat(value) : null,
    });
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setShowBackdating(!showBackdating)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="text-xs font-semibold text-slate-700">Backdating / Historical Price</span>
        <span className="text-xs text-slate-400">{showBackdating ? '▲' : '▼'}</span>
      </button>

      {showBackdating && (
        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-500">
            If a High/Low price is requested, input the Yahoo Finance historical data value for the task creation date ({task.requestDate}).
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                High Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={task.highPrice ?? ''}
                  onChange={(e) => handlePriceChange('highPrice', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">
                Low Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={task.lowPrice ?? ''}
                  onChange={(e) => handlePriceChange('lowPrice', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {task.highPrice != null && task.lowPrice != null && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Midpoint Price:</span>
                <span className="font-mono font-medium">${((task.highPrice + task.lowPrice) / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Spread:</span>
                <span className="font-mono font-medium">${(task.highPrice - task.lowPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Adjusted Amount (at midpoint):</span>
                <span className="font-mono font-semibold">
                  ${(task.quantity * ((task.highPrice + task.lowPrice) / 2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-400">
            Source: Yahoo Finance Historical Data for {task.symbol} on {task.requestDate}
          </p>
        </div>
      )}
    </div>
  );
}
