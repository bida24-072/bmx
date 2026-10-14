/**
 * BMX Core — Canonical Enumerations
 *
 * Every enum in the warehouse receipt domain lives here.
 * These are the single source of truth for status codes,
 * categories, and classification values across the platform.
 */

import { z } from 'zod';

// ─── Receipt Identity ────────────────────────────────────────────────────────

export const ReceiptType = z.enum(['NEGOTIABLE', 'NON_NEGOTIABLE']);
export type ReceiptType = z.infer<typeof ReceiptType>;

export const ReceiptStatus = z.enum([
  'DRAFT',
  'ISSUED',
  'PLEDGED',
  'PARTIALLY_PLEDGED',
  'TOKENISED',
  'REDEEMED',
  'CANCELLED',
  'SUSPENDED',
]);
export type ReceiptStatus = z.infer<typeof ReceiptStatus>;

// ─── Parties ─────────────────────────────────────────────────────────────────

export const HolderType = z.enum([
  'PRODUCER',
  'BANK',
  'TRADER',
  'INVESTOR',
  'TOKEN_HOLDER',
]);
export type HolderType = z.infer<typeof HolderType>;

export const ProducerType = z.enum([
  'SMALLHOLDER',
  'COMMERCIAL_FARM',
  'FEEDLOT',
  'MINE',
  'AGGREGATOR',
]);
export type ProducerType = z.infer<typeof ProducerType>;

// ─── Commodity ───────────────────────────────────────────────────────────────

export const CommodityCategory = z.enum([
  'AGRICULTURAL',
  'PRECIOUS_METALS',
  'BASE_METALS',
  'ENERGY',
  'LIVESTOCK',
  'CRITICAL_MINERALS',
]);
export type CommodityCategory = z.infer<typeof CommodityCategory>;

export const UnitOfMeasure = z.enum([
  'KG',
  'MT',
  'TROY_OZ',
  'HEAD',
  'BBL',
  'LITRE',
]);
export type UnitOfMeasure = z.infer<typeof UnitOfMeasure>;

// ─── Vault & GGDS ────────────────────────────────────────────────────────────

export const GGDSCertificationStatus = z.enum([
  'PENDING',
  'CERTIFIED',
  'SUSPENDED',
]);
export type GGDSCertificationStatus = z.infer<typeof GGDSCertificationStatus>;

// ─── Pledge ──────────────────────────────────────────────────────────────────

export const PledgeStatus = z.enum([
  'UNPLEDGED',
  'PLEDGED',
  'PARTIALLY_PLEDGED',
  'RELEASED',
]);
export type PledgeStatus = z.infer<typeof PledgeStatus>;

// ─── Tokenisation ────────────────────────────────────────────────────────────

export const TokenisationStatus = z.enum([
  'NOT_TOKENISED',
  'TOKENISATION_PENDING',
  'TOKENISED',
  'REDEEMED',
]);
export type TokenisationStatus = z.infer<typeof TokenisationStatus>;

export const TokenStandard = z.enum([
  'ERC-3643',
  'ERC-1400',
  'FINX-NATIVE',
]);
export type TokenStandard = z.infer<typeof TokenStandard>;

// ─── Transfer ────────────────────────────────────────────────────────────────

export const TransferType = z.enum([
  'ISSUANCE',
  'ENDORSEMENT',
  'DELIVERY',
  'SMART_CONTRACT',
  'PLEDGE',
  'RELEASE',
  'REDEMPTION',
]);
export type TransferType = z.infer<typeof TransferType>;

// ─── Chain of Custody ────────────────────────────────────────────────────────

export const CustodyEventType = z.enum([
  'HARVEST',
  'EXTRACTION',
  'AGGREGATION',
  'TRANSPORT',
  'INSPECTION',
  'VAULT_INTAKE',
  'VAULT_STORAGE',
  'VAULT_RELEASE',
  'EXPORT',
]);
export type CustodyEventType = z.infer<typeof CustodyEventType>;

// ─── Currency ────────────────────────────────────────────────────────────────

export const Currency = z.enum(['BWP', 'USD', 'AED', 'ZAR']);
export type Currency = z.infer<typeof Currency>;
