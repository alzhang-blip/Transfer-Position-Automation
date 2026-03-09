export const agents = [
  { id: 'A1', name: 'Sarah Chen', team: 'TFSA/FHSA Team' },
  { id: 'A2', name: 'Mike Patel', team: 'TFSA/FHSA Team' },
  { id: 'A3', name: 'Jessica Wang', team: 'RSP Team' },
  { id: 'A4', name: 'Daniel Kim', team: 'RSP Team' },
  { id: 'A5', name: 'Rachel Singh', team: 'RESP Team' },
  { id: 'A6', name: 'Tom Nguyen', team: 'RESP Team' },
];

export const teams = ['All', 'TFSA/FHSA Team', 'RSP Team', 'RESP Team']; // Phase 1: source is always TFSA; tabs filter by destination type too

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
  const qty = overrides.quantity || Math.floor(Math.random() * 500) + 10;
  const price = overrides.price || +(Math.random() * 200 + 5).toFixed(2);
  return {
    id,
    requestDate: overrides.requestDate || '2026-03-05',
    sourceAccount: overrides.sourceAccount || randomAccount('5'),
    sourceName: overrides.sourceName || 'John Smith',
    destAccount: overrides.destAccount || randomAccount('5'),
    destName: overrides.destName || overrides.sourceName || 'John Smith',
    destStatus: overrides.destStatus || 'Approved',
    symbol: overrides.symbol || 'VFV.TO',
    currency: overrides.currency || 'CAD',
    quantity: qty,
    amount: +(qty * price).toFixed(2),
    price,
    assetClass: overrides.assetClass || 'ETF',
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
  // 1. TFSA → TFSA (same CX, clean — should auto-complete)
  makeTask('TRF-0001', {
    sourceAccount: '51234567',
    sourceName: 'James Wilson',
    destAccount: '59876543',
    destName: 'James Wilson',
    symbol: 'VFV.TO',
    quantity: 200,
    price: 112.45,
    assetClass: 'ETF',
  }),
  // 2. TFSA → FHSA (same CX)
  makeTask('TRF-0002', {
    sourceAccount: '52345678',
    sourceName: 'Patricia Davis',
    destAccount: '81234567',
    destName: 'Patricia Davis',
    symbol: 'XIU.TO',
    quantity: 150,
    price: 34.80,
    assetClass: 'ETF',
  }),
  // 3. TFSA → RRSP (same CX, USD security)
  makeTask('TRF-0003', {
    sourceAccount: '53456789',
    sourceName: 'Michael Brown',
    destAccount: '71234567',
    destName: 'Michael Brown',
    symbol: 'AAPL',
    currency: 'USD',
    quantity: 100,
    price: 198.50,
    assetClass: 'Equity',
  }),
  // 4. TFSA → Individual Margin (same CX, linked margin triggers manual, USD security)
  makeTask('TRF-0004', {
    sourceAccount: '54567890',
    sourceName: 'Linda Garcia',
    destAccount: '21234567',
    destName: 'Linda Garcia',
    symbol: 'MSFT',
    currency: 'USD',
    quantity: 300,
    price: 420.75,
    assetClass: 'Equity',
    linkedMarginAccount: '21234567',
    mktVal: 85000,
    mgnReq: 25000,
    totalPositions: 12,
  }),
  // 5. TFSA → Individual Cash (same CX)
  makeTask('TRF-0005', {
    sourceAccount: '55678901',
    sourceName: 'Robert Martinez',
    destAccount: '31234567',
    destName: 'Robert Martinez',
    symbol: 'TD.TO',
    quantity: 250,
    price: 88.50,
    assetClass: 'Equity',
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
    const qty = Math.floor(Math.random() * 500) + 10;
    const price = +(Math.random() * 200 + 5).toFixed(2);

    const sourceAcc = randomAccount(srcPrefix);

    tasks.push({
      id: `TRF-${String(i).padStart(4, '0')}`,
      requestDate: new Date(2026, 2, Math.ceil(Math.random() * 5)).toISOString().slice(0, 10),
      sourceAccount: sourceAcc,
      sourceName: srcName,
      destAccount: randomAccount(destPrefix),
      destName: destName,
      destStatus: statuses[Math.floor(Math.random() * statuses.length)],
      ...randomSymbol(),
      quantity: qty,
      amount: +(qty * price).toFixed(2),
      price,
      assetClass: ['Equity', 'ETF', 'MF', 'GIC', 'Bond'][Math.floor(Math.random() * 5)],
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

  // Cross-client (gifting) — LOD required
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
