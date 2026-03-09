import { validationRulesMatrix } from '../data/mockData';

export function getAccountType(accountNumber) {
  if (!accountNumber || accountNumber.length === 0) return 'Unknown';
  const prefix = accountNumber.charAt(0);
  switch (prefix) {
    case '5': return 'TFSA';
    case '7': return 'RRSP';
    case '8': return 'FHSA';
    case '2': return 'Margin';
    case '4': return 'Margin';
    case '3': return 'Cash';
    default: return 'Unknown';
  }
}

export function truncateAccount(accountNumber) {
  if (!accountNumber) return '';
  return accountNumber.slice(0, 8);
}

export function checkSameCX(sourceName, destName) {
  return sourceName === destName ? 'Yes' : 'No';
}

export function getTeamForAccount(accountNumber) {
  const type = getAccountType(accountNumber);
  if (type === 'TFSA' || type === 'FHSA') return 'TFSA/FHSA Team';
  if (type === 'RRSP') return 'RSP Team';
  return 'RESP Team';
}

export function calculateBuyingPower(mktVal, mgnReq, totalPositions, requestedPositions) {
  if (totalPositions === 0) return 0;
  return +((mktVal - mgnReq) / totalPositions * requestedPositions).toFixed(2);
}

export function getWithdrawalType(minWithdrawal, ytdWithdrawal) {
  const remaining = minWithdrawal - ytdWithdrawal;
  if (remaining > 0) return { type: 'Minimum', remaining: +remaining.toFixed(2) };
  return { type: 'Extra', remaining: 0 };
}

const ACCEPTED_DEST_STATUSES = ['Approved', 'Complete'];

export function findDuplicates(task, allTasks) {
  return allTasks.filter(
    (t) =>
      t.id !== task.id &&
      t.sourceAccount === task.sourceAccount &&
      t.destAccount === task.destAccount &&
      t.symbol === task.symbol &&
      t.quantity === task.quantity
  );
}

/**
 * Checks if this task is the first transfer of the day for its source account
 * and holder name. Only the first one gets automated; subsequent ones go manual.
 */
function isFirstTransferOfDay(task, allTasks) {
  const sameDaySameAccount = allTasks.filter(
    (t) =>
      t.sourceAccount === task.sourceAccount &&
      t.sourceName === task.sourceName &&
      t.requestDate === task.requestDate
  );
  if (sameDaySameAccount.length <= 1) return true;
  sameDaySameAccount.sort((a, b) => a.id.localeCompare(b.id));
  return sameDaySameAccount[0].id === task.id;
}

/**
 * Determines the workflow routing: 'auto' or 'manual'.
 * Returns { workflow, reasons[] } where reasons lists every check that triggered manual.
 */
export function determineWorkflow(task, allTasks = []) {
  const reasons = [];

  // 1. Same CX check
  const isSameCX = task.sourceName === task.destName;
  if (!isSameCX) {
    reasons.push({ id: 'same-cx', label: 'Same CX: No — account holders differ' });
  }

  // 2. Short Position check
  if (task.hasShortPositions) {
    reasons.push({ id: 'short-position', label: 'Short position found in source TFSA' });
  }

  // 3. Multiple transfers per day
  if (!isFirstTransferOfDay(task, allTasks)) {
    reasons.push({ id: 'multi-transfer', label: 'Multiple transfers on same day for this account — only first is automated' });
  }

  // 4. Margin Power — TFSA linked to margin account
  if (task.linkedMarginAccount) {
    reasons.push({ id: 'margin-link', label: `TFSA linked to margin account ${truncateAccount(task.linkedMarginAccount)}` });
  }

  // 5. Ongoing requests on source account
  if (task.ongoingRequests && task.ongoingRequests.length > 0) {
    const types = task.ongoingRequests.map((r) => `${r.type} (${r.taskId})`).join(', ');
    reasons.push({ id: 'ongoing-request', label: `Ongoing request(s) on source: ${types}` });
  }

  return {
    workflow: reasons.length === 0 ? 'auto' : 'manual',
    reasons,
  };
}

export function validateTransfer(task, allTasks = []) {
  const srcType = getAccountType(task.sourceAccount);
  const destType = getAccountType(task.destAccount);
  const isSameCX = task.sourceName === task.destName;
  const giftSuffix = isSameCX ? '' : '_gift';
  const ruleKey = `${srcType}_to_${destType}${giftSuffix}`;
  const rule = validationRulesMatrix[ruleKey];

  const { workflow, reasons: workflowReasons } = determineWorkflow(task, allTasks);

  const checks = [];

  // --- Pre-validation checks ---

  checks.push({
    id: 'source-prefix',
    label: `Source account prefix: ${task.sourceAccount.charAt(0)} (${srcType})`,
    passed: task.sourceAccount.startsWith('5'),
    auto: true,
  });

  checks.push({
    id: 'account-format',
    label: `Account numbers standardized to 8 digits (src: ${truncateAccount(task.sourceAccount)}, dest: ${truncateAccount(task.destAccount)})`,
    passed: truncateAccount(task.sourceAccount).length === 8 && truncateAccount(task.destAccount).length === 8,
    auto: true,
  });

  const duplicates = findDuplicates(task, allTasks);
  checks.push({
    id: 'duplicate-check',
    label: duplicates.length > 0
      ? `Potential duplicate detected: ${duplicates.map((d) => d.id).join(', ')}`
      : 'No duplicate transfer requests found',
    passed: duplicates.length === 0,
    auto: true,
  });

  checks.push({
    id: 'dest-status',
    label: `Destination account status: ${task.destStatus}`,
    passed: ACCEPTED_DEST_STATUSES.includes(task.destStatus),
    auto: true,
  });

  // --- Workflow routing checks ---

  checks.push({
    id: 'same-cx',
    label: `Same CX: ${isSameCX ? 'Yes' : 'No'} — Source: ${task.sourceName} | Dest: ${task.destName}${!isSameCX ? ' → manual review' : ''}`,
    passed: isSameCX,
    auto: true,
    routing: true,
  });

  checks.push({
    id: 'short-position',
    label: task.hasShortPositions
      ? 'Short position found in source TFSA → manual review'
      : 'No short positions in source TFSA',
    passed: !task.hasShortPositions,
    auto: true,
    routing: true,
  });

  const firstOfDay = isFirstTransferOfDay(task, allTasks);
  checks.push({
    id: 'multi-transfer',
    label: firstOfDay
      ? 'First transfer of the day for this account — eligible for automation'
      : 'Subsequent transfer of the day for this account → manual review',
    passed: firstOfDay,
    auto: true,
    routing: true,
  });

  checks.push({
    id: 'margin-link',
    label: task.linkedMarginAccount
      ? `TFSA linked to margin account ${truncateAccount(task.linkedMarginAccount)} → manual review`
      : 'No linked margin account',
    passed: !task.linkedMarginAccount,
    auto: true,
    routing: true,
  });

  checks.push({
    id: 'ongoing-request',
    label: task.ongoingRequests && task.ongoingRequests.length > 0
      ? `Ongoing request(s) on source account → manual review`
      : 'No ongoing withdrawal/transfer-out requests on source',
    passed: !task.ongoingRequests || task.ongoingRequests.length === 0,
    auto: true,
    routing: true,
  });

  // --- Transfer rule checks ---

  if (rule) {
    checks.push({
      id: 'transfer-rule',
      label: `Rule (${srcType} → ${destType}): ${rule.notes}`,
      passed: !rule.notes.includes('Not permitted'),
      auto: true,
    });

    if (rule.lodRequired) {
      checks.push({
        id: 'gifting-lod',
        label: 'Gifting LOD required — QT Letter of Direction on file',
        passed: null,
        auto: false,
      });
    }
  } else {
    checks.push({
      id: 'transfer-rule',
      label: `No rule found for ${srcType} → ${destType}${giftSuffix}`,
      passed: false,
      auto: true,
    });
  }

  if (destType === 'Margin') {
    checks.push({
      id: 'buying-power',
      label: 'Margin buying power verified',
      passed: null,
      auto: false,
    });
  }

  if (srcType === 'RRSP' || destType === 'RRSP') {
    checks.push({
      id: 'rrif-withdrawal',
      label: 'RRIF withdrawal type confirmed (if applicable)',
      passed: null,
      auto: false,
    });
  }

  if (destType === 'TFSA' || destType === 'FHSA') {
    checks.push({
      id: 'contribution-room',
      label: `${destType} contribution room verified`,
      passed: null,
      auto: false,
    });
  }

  checks.push({
    id: 'positions-available',
    label: 'Sufficient positions available in source account',
    passed: null,
    auto: false,
  });

  return { ruleKey, rule, checks, srcType, destType, isSameCX, workflow, workflowReasons };
}
