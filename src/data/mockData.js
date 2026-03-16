export const agents = [
  { id: 'A1', name: 'Sarah Chen', team: 'TFSA/FHSA Team' },
  { id: 'A2', name: 'Mike Patel', team: 'TFSA/FHSA Team' },
  { id: 'A3', name: 'Jessica Wang', team: 'RSP Team' },
  { id: 'A4', name: 'Daniel Kim', team: 'RSP Team' },
  { id: 'A5', name: 'Rachel Singh', team: 'RESP Team' },
  { id: 'A6', name: 'Tom Nguyen', team: 'RESP Team' },
];

export const teams = ['All', 'TFSA/FHSA Team', 'RSP Team', 'RESP Team'];

const symbolList = [
  { symbol: 'AAPL', currency: 'USD' },
  { symbol: 'MSFT', currency: 'USD' },
  { symbol: 'GOOG', currency: 'USD' },
  { symbol: 'AMZN', currency: 'USD' },
  { symbol: 'TSLA', currency: 'USD' },
  { symbol: 'VFV.TO', currency: 'CAD' },
  { symbol: 'XIU.TO', currency: 'CAD' },
  { symbol: 'ZAG.TO', currency: 'CAD' },
  { symbol: 'BNS.TO', currency: 'CAD' },
  { symbol: 'RY.TO', currency: 'CAD' },
  { symbol: 'TD.TO', currency: 'CAD' },
  { symbol: 'ENB.TO', currency: 'CAD' },
  { symbol: 'MFC.TO', currency: 'CAD' },
  { symbol: 'SU.TO', currency: 'CAD' },
  { symbol: 'CNQ.TO', currency: 'CAD' },
];

const randomSymbol = () => symbolList[Math.floor(Math.random() * symbolList.length)];

function randomPositions(min = 1, max = 5) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const used = new Set();
  const positions = [];
  for (let i = 0; i < count; i++) {
    let s;
    do { s = randomSymbol(); } while (used.has(s.symbol) && used.size < symbolList.length);
    used.add(s.symbol);
    const qty = Math.floor(Math.random() * 500) + 10;
    positions.push({
      symbol: s.symbol,
      currency: s.currency,
      quantity: qty,
      assetClass: ['Equity', 'ETF', 'MF', 'GIC', 'Bond'][Math.floor(Math.random() * 5)],
    });
  }
  return positions;
}

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];

const randomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const accountPrefixes = ['5', '7', '8', '2', '4', '3'];
const randomAccount = (prefix) => {
  const p = prefix || accountPrefixes[Math.floor(Math.random() * accountPrefixes.length)];
  return p + String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
};

const statuses = ['Approved', 'Approved', 'Complete'];

function makeTask(id, overrides) {
  const positions = overrides.positions || [{
    symbol: overrides.symbol || 'VFV.TO',
    currency: overrides.currency || 'CAD',
    quantity: overrides.quantity || Math.floor(Math.random() * 500) + 10,
    assetClass: overrides.assetClass || 'ETF',
  }];

  return {
    id,
    requestDate: overrides.requestDate || '2026-03-05',
    sourceAccount: overrides.sourceAccount || randomAccount('5'),
    sourceName: overrides.sourceName || 'John Smith',
    destAccount: overrides.destAccount || randomAccount('5'),
    destName: overrides.destName || overrides.sourceName || 'John Smith',
    destStatus: overrides.destStatus || 'Approved',
    positions,
    status: 'Active',
    assignedTo: null,
    sameCX: (overrides.sourceName || 'John Smith') === (overrides.destName || overrides.sourceName || 'John Smith'),
    sameLastName: (overrides.sourceName || 'John Smith').split(' ')[1] === (overrides.destName || overrides.sourceName || 'John Smith').split(' ')[1],
    notes: '',
    showOnMyQuestrade: true,
    rejectionReason: null,
    mktVal: overrides.mktVal || +(Math.random() * 100000 + 10000).toFixed(2),
    mgnReq: overrides.mgnReq || +(Math.random() * 40000 + 5000).toFixed(2),
    totalPositions: overrides.totalPositions || Math.floor(Math.random() * 20) + 5,
    minWithdrawal: +(Math.random() * 5000 + 500).toFixed(2),
    ytdWithdrawal: +(Math.random() * 3000).toFixed(2),
    hasShortPositions: overrides.hasShortPositions || false,
    linkedMarginAccount: overrides.linkedMarginAccount || null,
    ongoingRequests: overrides.ongoingRequests || [],
    workflow: null,
    workflowReasons: [],
  };
}

const seedTasks = [
  makeTask('TRF-0001', {
    sourceAccount: '51234567',
    sourceName: 'James Wilson',
    destAccount: '59876543',
    destName: 'James Wilson',
    positions: [
      { symbol: 'VFV.TO', currency: 'CAD', quantity: 200, assetClass: 'ETF' },
      { symbol: 'XIU.TO', currency: 'CAD', quantity: 100, assetClass: 'ETF' },
    ],
  }),
  makeTask('TRF-0002', {
    sourceAccount: '52345678',
    sourceName: 'Patricia Davis',
    destAccount: '81234567',
    destName: 'Patricia Davis',
    positions: [
      { symbol: 'XIU.TO', currency: 'CAD', quantity: 150, assetClass: 'ETF' },
    ],
  }),
  makeTask('TRF-0003', {
    sourceAccount: '53456789',
    sourceName: 'Michael Brown',
    destAccount: '71234567',
    destName: 'Michael Brown',
    positions: [
      { symbol: 'AAPL', currency: 'USD', quantity: 100, assetClass: 'Equity' },
      { symbol: 'MSFT', currency: 'USD', quantity: 50, assetClass: 'Equity' },
      { symbol: 'VFV.TO', currency: 'CAD', quantity: 300, assetClass: 'ETF' },
    ],
  }),
  makeTask('TRF-0004', {
    sourceAccount: '54567890',
    sourceName: 'Linda Garcia',
    destAccount: '21234567',
    destName: 'Linda Garcia',
    positions: [
      { symbol: 'MSFT', currency: 'USD', quantity: 300, assetClass: 'Equity' },
    ],
    linkedMarginAccount: '21234567',
    mktVal: 85000,
    mgnReq: 25000,
    totalPositions: 12,
  }),
  makeTask('TRF-0005', {
    sourceAccount: '55678901',
    sourceName: 'Robert Martinez',
    destAccount: '31234567',
    destName: 'Robert Martinez',
    positions: [
      { symbol: 'TD.TO', currency: 'CAD', quantity: 250, assetClass: 'Equity' },
      { symbol: 'RY.TO', currency: 'CAD', quantity: 180, assetClass: 'Equity' },
      { symbol: 'ENB.TO', currency: 'CAD', quantity: 400, assetClass: 'Equity' },
      { symbol: 'BNS.TO', currency: 'CAD', quantity: 120, assetClass: 'Equity' },
    ],
  }),
];

export function generateMockTasks(count = 30) {
  const tasks = [...seedTasks];

  for (let i = seedTasks.length + 1; i <= count; i++) {
    const srcPrefix = '5';
    const destPrefix = accountPrefixes[Math.floor(Math.random() * accountPrefixes.length)];
    const sameCX = Math.random() > 0.4;
    const srcName = randomName();
    const destName = sameCX ? srcName : randomName();
    const sameLastName = srcName.split(' ')[1] === destName.split(' ')[1];

    const sourceAcc = randomAccount(srcPrefix);
    const positions = randomPositions(1, 4);

    tasks.push({
      id: `TRF-${String(i).padStart(4, '0')}`,
      requestDate: new Date(2026, 2, Math.ceil(Math.random() * 5)).toISOString().slice(0, 10),
      sourceAccount: sourceAcc,
      sourceName: srcName,
      destAccount: randomAccount(destPrefix),
      destName: destName,
      destStatus: statuses[Math.floor(Math.random() * statuses.length)],
      positions,
      status: 'Active',
      assignedTo: null,
      sameCX,
      sameLastName,
      notes: '',
      showOnMyQuestrade: true,
      rejectionReason: null,
      mktVal: +(Math.random() * 100000 + 10000).toFixed(2),
      mgnReq: +(Math.random() * 40000 + 5000).toFixed(2),
      totalPositions: Math.floor(Math.random() * 20) + 5,
      minWithdrawal: +(Math.random() * 5000 + 500).toFixed(2),
      ytdWithdrawal: +(Math.random() * 3000).toFixed(2),
      hasShortPositions: Math.random() < 0.15,
      linkedMarginAccount: Math.random() < 0.2 ? randomAccount('2') : null,
      ongoingRequests: Math.random() < 0.2
        ? [{ type: ['Withdrawal', 'Transfer-Out', 'Internal Cash Transfer'][Math.floor(Math.random() * 3)], taskId: `PND-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}` }]
        : [],
      workflow: null,
      workflowReasons: [],
    });
  }

  return tasks;
}

export function positionSummary(task) {
  if (!task.positions || task.positions.length === 0) return '';
  if (task.positions.length === 1) {
    return `${task.positions[0].symbol} (${task.positions[0].quantity})`;
  }
  return `${task.positions.length} positions`;
}

export const validationRulesMatrix = {
  TFSA_to_TFSA: { sameCX: true, lodRequired: false, notes: 'Direct transfer allowed' },
  TFSA_to_RRSP: { sameCX: true, lodRequired: false, notes: 'Contribution room check required' },
  TFSA_to_FHSA: { sameCX: true, lodRequired: false, notes: 'FHSA eligibility check required' },
  TFSA_to_Margin: { sameCX: true, lodRequired: false, notes: 'Withdrawal — no contribution impact' },
  TFSA_to_Cash: { sameCX: true, lodRequired: false, notes: 'Withdrawal to individual cash account' },
  RRSP_to_RRSP: { sameCX: true, lodRequired: false, notes: 'Direct registered transfer' },
  RRSP_to_TFSA: { sameCX: true, lodRequired: false, notes: 'Deregistration — taxable event' },
  RRSP_to_Margin: { sameCX: true, lodRequired: false, notes: 'Deregistration — taxable event' },
  RRSP_to_FHSA: { sameCX: true, lodRequired: false, notes: 'Not permitted directly' },
  FHSA_to_FHSA: { sameCX: true, lodRequired: false, notes: 'Direct transfer allowed' },
  FHSA_to_RRSP: { sameCX: true, lodRequired: false, notes: 'FHSA to RRSP rollover' },
  FHSA_to_TFSA: { sameCX: true, lodRequired: false, notes: 'Qualifying withdrawal only' },
  FHSA_to_Margin: { sameCX: true, lodRequired: false, notes: 'Taxable withdrawal' },
  Margin_to_Margin: { sameCX: true, lodRequired: false, notes: 'Direct transfer allowed' },
  Margin_to_TFSA: { sameCX: true, lodRequired: false, notes: 'Contribution room check required' },
  Margin_to_RRSP: { sameCX: true, lodRequired: false, notes: 'Contribution room check required' },
  Margin_to_FHSA: { sameCX: true, lodRequired: false, notes: 'FHSA eligibility check required' },
  TFSA_to_TFSA_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD required' },
  TFSA_to_Margin_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD required' },
  TFSA_to_Cash_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD required' },
  RRSP_to_RRSP_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD & spousal verification' },
  Margin_to_Margin_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD required' },
  Margin_to_TFSA_gift: { sameCX: false, lodRequired: true, notes: 'Gifting — QT LOD required' },
  FHSA_to_FHSA_gift: { sameCX: false, lodRequired: false, notes: 'Not permitted — FHSA non-transferable across CX' },
};

export const rejectionReasons = [
  'Insufficient positions in source account',
  'Destination account not approved',
  'Destination account on hold — pending compliance review',
  'Contribution room exceeded for destination account',
  'Account holder name mismatch — LOD not provided',
  'Symbol not supported for transfer in destination account type',
  'FHSA lifetime contribution limit reached',
  'Margin requirements not met in destination account',
];

export const offsetAccount = '0902647510';
