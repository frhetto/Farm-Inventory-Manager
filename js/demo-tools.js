/**
 * Farm Inventory Manager - Interactive Demo Tools
 * 1. Deterministic 12-Digit Barcode Generator (SHA-256)
 * 2. Offline-First Sync Queue Simulator
 * 3. Linked Financial Impact Calculator
 */

// --- 1. SHA-256 DETERMINISTIC 12-DIGIT BARCODE ENGINE ---
async function generateDeterministic12DigitBarcode(inputString) {
  if (!inputString || inputString.trim() === '') {
    inputString = 'FARM-DEFAULT-ITEM-001';
  }

  // Calculate SHA-256 hash
  const msgUint8 = new TextEncoder().encode(inputString.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Extract a deterministic 11-digit number from first 14 hex characters
  // using BigInt modulo 10^11
  const hexSlice = hashHex.substring(0, 14);
  const bigNum = BigInt('0x' + hexSlice);
  const elevenDigits = (bigNum % 100000000000n).toString().padStart(11, '0');

  // Compute checksum digit (Luhn-style modulo 10 algorithm)
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(elevenDigits[i], 10);
    sum += (i % 2 === 0) ? digit * 1 : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  const final12Barcode = elevenDigits + checkDigit.toString();

  return {
    rawInput: inputString,
    hashHex: hashHex,
    barcode: final12Barcode,
    formatted: `${final12Barcode.slice(0, 1)} ${final12Barcode.slice(1, 6)} ${final12Barcode.slice(6, 11)} ${final12Barcode.slice(11, 12)}`
  };
}

// Generate simple SVG barcode bars representation based on barcode digits
function renderSvgBarcode(barcodeStr) {
  // Deterministic bar widths based on digits
  let x = 10;
  let rects = '';
  // Guard bars at start
  rects += `<rect x="${x}" y="10" width="3" height="70" fill="currentColor"/>`;
  rects += `<rect x="${x + 6}" y="10" width="3" height="70" fill="currentColor"/>`;
  x += 16;

  for (let i = 0; i < barcodeStr.length; i++) {
    const digit = parseInt(barcodeStr[i], 10);
    const w1 = ((digit % 3) + 1) * 2;
    const w2 = (((digit + 2) % 4) + 1) * 2;
    rects += `<rect x="${x}" y="10" width="${w1}" height="60" fill="currentColor"/>`;
    x += w1 + 3;
    rects += `<rect x="${x}" y="10" width="${w2}" height="60" fill="currentColor"/>`;
    x += w2 + 4;
    if (i === 5) {
      // Center guard bars
      x += 4;
      rects += `<rect x="${x}" y="10" width="3" height="70" fill="currentColor"/>`;
      rects += `<rect x="${x + 6}" y="10" width="3" height="70" fill="currentColor"/>`;
      x += 14;
    }
  }

  // Guard bars at end
  rects += `<rect x="${x}" y="10" width="3" height="70" fill="currentColor"/>`;
  rects += `<rect x="${x + 6}" y="10" width="3" height="70" fill="currentColor"/>`;
  x += 16;

  return `
    <svg viewBox="0 0 ${x + 10} 100" class="w-full h-24 max-w-sm mx-auto text-slate-800 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg">
      ${rects}
      <text x="${x / 2}" y="92" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="currentColor">${barcodeStr}</text>
    </svg>
  `;
}

// --- 2. OFFLINE-FIRST SYNC QUEUE SIMULATOR ---
class OfflineSyncSimulator {
  constructor() {
    this.isOnline = true;
    this.localQueue = [];
    this.serverDatabase = [
      { id: 'REC-001', item: 'Organic Fertilizer (50kg)', type: 'Restock', qty: 20, impact: '-$300.00', status: 'COMMITTED', time: '10:14 AM' },
      { id: 'REC-002', item: 'Fresh Goat Milk (10L)', type: 'Sale', qty: 10, impact: '+$85.00', status: 'COMMITTED', time: '11:22 AM' },
      { id: 'REC-003', item: 'Wheat Seeds Batch #9', type: 'Restock', qty: 50, impact: '-$450.00', status: 'COMMITTED', time: '01:05 PM' }
    ];
  }

  toggleNetworkStatus() {
    this.isOnline = !this.isOnline;
    return this.isOnline;
  }

  addRecord(itemName, type, qty, unitPrice) {
    const totalImpact = (type === 'Sale' ? 1 : -1) * (qty * unitPrice);
    const impactFormatted = (totalImpact >= 0 ? '+$' : '-$') + Math.abs(totalImpact).toFixed(2);
    
    const record = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      item: itemName,
      type: type,
      qty: qty,
      impact: impactFormatted,
      status: this.isOnline ? 'COMMITTED' : 'PENDING_OFFLINE',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    if (this.isOnline) {
      this.serverDatabase.unshift(record);
      return { success: true, queued: false, record };
    } else {
      this.localQueue.push(record);
      return { success: true, queued: true, record };
    }
  }

  syncLocalQueue() {
    if (!this.isOnline) {
      return { success: false, message: 'Cannot sync while offline! Please connect to network first.' };
    }
    const count = this.localQueue.length;
    if (count === 0) {
      return { success: true, count: 0, message: 'Local queue is already clean (0 pending records).' };
    }

    // Flush all to server database
    while (this.localQueue.length > 0) {
      const item = this.localQueue.shift();
      item.status = 'COMMITTED';
      this.serverDatabase.unshift(item);
    }

    return { success: true, count: count, message: `Successfully synced ${count} pending record(s) to server database!` };
  }
}

// Global instances
window.demoBarcode = {
  generate: generateDeterministic12DigitBarcode,
  renderSvg: renderSvgBarcode
};
window.syncSimulator = new OfflineSyncSimulator();

