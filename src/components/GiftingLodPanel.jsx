import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { truncateAccount } from '../utils/validation';

export default function GiftingLodPanel({ task }) {
  const { dispatch } = useTaskContext();
  const [giftingLodProvided, setGiftingLodProvided] = useState(false);
  const [lodEmailSent, setLodEmailSent] = useState(false);
  const [lodEmailSending, setLodEmailSending] = useState(false);

  if (!task) return null;

  const isSameCX = task.sourceName === task.destName;
  if (isSameCX) return null;

  return (
    <div className="p-4 rounded-lg border border-purple-800/50 bg-purple-900/20">
      <h4 className="text-xs font-semibold text-purple-300 mb-2">Gifting LOD Verification</h4>
      <p className="text-xs text-purple-400 mb-3">
        Account holders differ — a QT Letter of Direction is required.
      </p>

      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={giftingLodProvided}
            onChange={(e) => setGiftingLodProvided(e.target.checked)}
            className="h-4 w-4 rounded border-purple-600 text-purple-600 focus:ring-purple-500 bg-[#0d1117]"
          />
          <span className="text-xs font-medium text-purple-300">QT LOD is on file and verified</span>
        </label>

        {!giftingLodProvided && (
          <div className="border-t border-purple-800/50 pt-3">
            {lodEmailSent ? (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-900/20 border border-emerald-700/50">
                <span className="text-emerald-400 mt-0.5">&#10003;</span>
                <div>
                  <p className="text-xs font-medium text-emerald-400">LOD request email sent</p>
                  <p className="text-[10px] text-emerald-500/80 mt-0.5">
                    Sent to {task.sourceName} for transfer {task.id} ({truncateAccount(task.sourceAccount)} &rarr; {truncateAccount(task.destAccount)})
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-purple-500 mb-2">
                  No LOD on file. Send an email to the client requesting they submit a signed Letter of Direction.
                </p>
                <button
                  disabled={lodEmailSending}
                  onClick={() => {
                    setLodEmailSending(true);
                    setTimeout(() => {
                      setLodEmailSending(false);
                      setLodEmailSent(true);
                      dispatch({
                        type: 'SET_STATUS',
                        taskId: task.id,
                        status: 'Pending',
                      });
                      dispatch({
                        type: 'LOG_ENTRY',
                        taskId: task.id,
                        message: `LOD request email sent to ${task.sourceName} for gifting transfer to ${task.destName}`,
                        sheet: 'LOD Requests',
                      });
                    }, 1200);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {lodEmailSending ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>&#9993;</span>
                      Email LOD Request to Client
                    </>
                  )}
                </button>
                <p className="text-[10px] text-purple-500/70 mt-2">
                  This will send a templated LOD request email and set the task to Pending status.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
