# BMX Core — Digital Rails

The canonical data model and validation layer for the Botswana Mercantile
Exchange (BMX) warehouse receipt system. GGDS-compliant, FinX-ready.

## What This Is

This package defines the `WarehouseReceipt` — the digital instrument that
certifies a commodity's existence, quality, and ownership inside the BMX
Gaborone vault. It is the foundation for:

- Farmer / feedlot producer onboarding
- Vault operations and GGDS certification
- Bank collateral pledging (e.g., FMD liquidity relief)
- Tokenisation on DMCC FinX
- The Dubai–Gaborone trade corridor

## Install

```bash
npm installimport { validateReceipt } from '@bmx/core';
import maizeReceipt from './fixtures/maize-receipt-example.json' assert { type: 'json' };

const result = validateReceipt(maizeReceipt);

if (result.valid) {
  console.log('✅ Receipt is valid:', result.receipt.identification.receipt_number);
} else {
  console.error('❌ Validation failed:', result.errors);
}
---

## 🚀 How to Bring It to Life (60 seconds)

```bash
# 1. Create the repo
mkdir bmx-core && cd bmx-core
git init

# 2. Paste all 12 files into the paths shown above

# 3. Install + verify
npm install
npm run lint           # TypeScript compiles clean
npx tsx -e "
  import { validateReceipt } from './src/index.ts';
  import maize from './fixtures/maize-receipt-example.json' assert { type: 'json' };
  const r = validateReceipt(maize);
  console.log(r.valid ? '✅ MAIZE VALID' : r.errors);
"
