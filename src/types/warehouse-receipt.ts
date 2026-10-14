/**
 * BMX Core — Warehouse Receipt Data Model
 *
 * This is THE canonical schema. It satisfies three legal frameworks:
 *   1. UNCITRAL Model Law on Warehouse Receipts
 *   2. DMCC Tradeflow Warrant Rules (GGDS)
 *   3. DMCC FinX tokenisation requirements
 *
 * Monetary values are strings to preserve decimal precision.
 * Quantities are numbers (floating-point tolerance is acceptable for
 * weight/volume; adjust to string decimals if your commodity demands it).
 *
 * Dates are ISO 8601 strings (UTC) — never Date objects — so receipts
 * serialize cleanly across the wire and into the ledger.
 */

import { z } from 'zod';
import {
  ReceiptType,
  ReceiptStatus,
  HolderType,
  ProducerType,
  CommodityCategory,
  UnitOfMeasure,
  GGDSCertificationStatus,
  PledgeStatus,
  TokenisationStatus,
  TokenStandard,
  TransferType,
  CustodyEventType,
  Currency,
} from './enums.js';

// ─── Reusable Primitives ─────────────────────────────────────────────────────

/** ISO 8601 datetime string in UTC. */
export const Iso8601 = z.string().datetime({ offset: false });

/** Decimal value encoded as a string to preserve precision. */
export const DecimalString = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'Must be a non-negative decimal string');

/** GeoJSON Point geometry. */
export const GeoJsonPoint = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

// ─── 1. Identification & Status ──────────────────────────────────────────────

export const IdentificationSchema = z.object({
  receipt_id: z.string().uuid(),
  receipt_number: z
    .string()
    .regex(/^BMX-[A-Z]{3}-\d{4}-\d{6}$/, 'Format: BMX-GAB-2026-000142'),
  receipt_type: ReceiptType,
  status: ReceiptStatus,
  issuance_date: Iso8601,
  suspension_date: Iso8601.optional(),
  cancellation_date: Iso8601.optional(),
  redemption_date: Iso8601.optional(),
  blockchain_tx_hash: z.string().optional(),
});

// ─── 2. Parties ──────────────────────────────────────────────────────────────

export const DepositorSchema = z.object({
  depositor_id: z.string().uuid(),
  depositor_legal_name: z.string().min(2),
  depositor_national_id: z.string().min(3),
  depositor_contact: z.object({
    phone: z.string().min(7),
    email: z.string().email().optional(),
    physical_address: z.string().min(3),
  }),
});

export const WarehouseOperatorSchema = z.object({
  warehouse_operator_id: z.string().uuid(),
  warehouse_operator_legal_name: z.string().min(2),
  warehouse_operator_licence: z.string().min(2),
});

export const CurrentHolderSchema = z.object({
  current_holder_id: z.string().uuid(),
  current_holder_type: HolderType,
});

export const ThirdPartyClaimSchema = z.object({
  claimant_id: z.string().uuid(),
  claimant_name: z.string().min(2),
  claim_type: z.string().min(2),
  claim_description: z.string().min(2),
  notified_at: Iso8601,
});

export const PartiesSchema = z.object({
  depositor: DepositorSchema,
  warehouse_operator: WarehouseOperatorSchema,
  current_holder: CurrentHolderSchema,
  third_party_claims: z.array(ThirdPartyClaimSchema).default([]),
});

// ─── 3. Commodity Description ────────────────────────────────────────────────

export const QualityParametersSchema = z.record(
  z.string(),
  z.union([z.number(), z.string(), z.boolean()])
);

export const CommoditySchema = z.object({
  commodity_category: CommodityCategory,
  commodity_type: z.string().min(2),
  commodity_grade: z.string().min(1),
  quantity: z.number().positive(),
  unit_of_measure: UnitOfMeasure,
  quality_parameters: QualityParametersSchema,
  quality_inspection_certificate: z.string().min(2),
  quality_inspection_date: Iso8601,
});

// ─── 4. Origin & Traceability (GGDS) ─────────────────────────────────────────

export const EconomicImpactSchema = z.object({
  employment_count: z.number().int().nonnegative().optional(),
  community_benefit_notes: z.string().optional(),
  royalty_payments: DecimalString.optional(),
  royalty_currency: Currency.optional(),
});

export const CustodyEventSchema = z.object({
  event_type: CustodyEventType,
  timestamp: Iso8601,
  actor_id: z.string().uuid(),
  actor_name: z.string().min(2),
  location: z.string().min(2),
  geo: GeoJsonPoint.optional(),
  notes: z.string().optional(),
});

export const OriginSchema = z.object({
  origin_farm_id: z.string().uuid().optional(),
  origin_coordinates: GeoJsonPoint.optional(),
  origin_district: z.string().min(2),
  harvest_or_extraction_date: Iso8601,
  producer_type: ProducerType,
  sustainability_certifications: z.array(z.string()).default([]),
  economic_impact_data: EconomicImpactSchema.optional(),
  chain_of_custody: z.array(CustodyEventSchema).min(1),
});

// ─── 5. Vault & Storage ──────────────────────────────────────────────────────

export const VaultConditionsSchema = z.object({
  temperature_celsius: z.number().optional(),
  humidity_percent: z.number().min(0).max(100).optional(),
  security_classification: z.string().min(2),
  shelf_life_days: z.number().int().positive().optional(),
});

export const VaultSchema = z.object({
  vault_id: z.string().uuid(),
  vault_location: z.object({
    name: z.string().min(2),
    address: z.string().min(2),
    city: z.string().min(2),
    country: z.string().min(2),
  }),
  storage_location_detail: z.string().min(1),
  storage_start_date: Iso8601,
  storage_fee_rate: DecimalString,
  insurance_policy_number: z.string().optional(),
  insured_value: DecimalString.optional(),
  vault_conditions: VaultConditionsSchema,
  ggds_certification_status: GGDSCertificationStatus,
  ggds_certificate_number: z.string().optional(),
});

// ─── 6. Valuation ────────────────────────────────────────────────────────────

export const ValuationSchema = z.object({
  reference_price: DecimalString,
  reference_price_currency: Currency,
  reference_price_date: Iso8601,
  collateral_valuation_coefficient: DecimalString.optional(),
  loan_to_value_ratio: DecimalString.optional(),
});

// ─── 7. Pledge & Financing ───────────────────────────────────────────────────

export const PledgeSchema = z.object({
  pledge_status: PledgeStatus,
  pledged_to_institution_id: z.string().uuid().optional(),
  pledged_to_institution_name: z.string().optional(),
  pledge_amount: DecimalString.optional(),
  pledge_interest_rate: DecimalString.optional(),
  pledge_start_date: Iso8601.optional(),
  pledge_maturity_date: Iso8601.optional(),
  pledge_release_conditions: z
    .object({
      repayment_required: z.boolean(),
      substitution_allowed: z.boolean(),
      notes: z.string().optional(),
    })
    .optional(),
});

// ─── 8. Tokenisation (FinX-Ready) ────────────────────────────────────────────

export const TokenHolderEligibilitySchema = z.object({
  requires_kyc: z.boolean(),
  requires_accredited_investor: z.boolean(),
  allowed_jurisdictions: z.array(z.string()).default([]),
  restricted_jurisdictions: z.array(z.string()).default([]),
});

export const TokenisationSchema = z.object({
  tokenisation_status: TokenisationStatus,
  token_id: z.string().optional(),
  token_standard: TokenStandard.optional(),
  token_contract_address: z.string().optional(),
  token_supply: DecimalString.optional(),
  token_price_per_unit: DecimalString.optional(),
  token_holder_eligibility: TokenHolderEligibilitySchema.optional(),
  shariah_compliance_flag: z.boolean().default(false),
  tokenised_parcel_size: DecimalString.optional(),
});

// ─── 9. Transfer History ─────────────────────────────────────────────────────

export const TransferRecordSchema = z.object({
  transfer_type: TransferType,
  from_holder_id: z.string().uuid().nullable(),
  to_holder_id: z.string().uuid().nullable(),
  timestamp: Iso8601,
  consideration: DecimalString.optional(),
  consideration_currency: Currency.optional(),
  tx_hash: z.string().optional(),
});

export const TransferHistorySchema = z.object({
  transfer_history: z.array(TransferRecordSchema).min(1),
  negotiation_type: z
    .enum(['ENDORSEMENT', 'DELIVERY', 'SMART_CONTRACT'])
    .optional(),
});

// ─── 10. Audit & Integrity ───────────────────────────────────────────────────

export const AuditEntrySchema = z.object({
  timestamp: Iso8601,
  actor_id: z.string().uuid(),
  action: z.string().min(2),
  previous_state_hash: z.string().min(2),
});

export const AuditSchema = z.object({
  created_at: Iso8601,
  last_updated_at: Iso8601,
  digital_signature: z.string().min(10),
  signature_algorithm: z.enum(['ECDSA-secp256k1', 'Ed25519']),
  audit_log: z.array(AuditEntrySchema),
  document_hash: z.string().regex(/^[a-f0-9]{64}$/, 'Must be SHA-256 hex'),
});

// ─── Composite: The Warehouse Receipt ────────────────────────────────────────

export const WarehouseReceiptSchema = z
  .object({
    identification: IdentificationSchema,
    parties: PartiesSchema,
    commodity: CommoditySchema,
    origin: OriginSchema,
    vault: VaultSchema,
    valuation: ValuationSchema,
    pledge: PledgeSchema,
    tokenisation: TokenisationSchema,
    transfer: TransferHistorySchema,
    audit: AuditSchema,
  })
  .superRefine((receipt, ctx) => {
    const { pledge, tokenisation, identification } = receipt;

    // Rule 1: If pledged, the institution and amount must be present.
    if (
      pledge.pledge_status === 'PLEDGED' ||
      pledge.pledge_status === 'PARTIALLY_PLEDGED'
    ) {
      if (!pledge.pledged_to_institution_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pledge', 'pledged_to_institution_id'],
          message: 'Required when pledge_status is PLEDGED or PARTIALLY_PLEDGED',
        });
      }
      if (!pledge.pledge_amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pledge', 'pledge_amount'],
          message: 'Required when pledge_status is PLEDGED or PARTIALLY_PLEDGED',
        });
      }
    }

    // Rule 2: If tokenised, the token fields must be present.
    if (tokenisation.tokenisation_status === 'TOKENISED') {
      const required: Array<keyof typeof tokenisation> = [
        'token_id',
        'token_standard',
        'token_contract_address',
        'token_supply',
        'token_price_per_unit',
      ];
      for (const field of required) {
        if (!tokenisation[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['tokenisation', field],
            message: 'Required when tokenisation_status is TOKENISED',
          });
        }
      }
      if (!identification.blockchain_tx_hash) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['identification', 'blockchain_tx_hash'],
          message: 'Required when tokenisation_status is TOKENISED',
        });
      }
    }

    // Rule 3: A receipt cannot be both REDEEMED and TOKENISED.
    if (
      identification.status === 'REDEEMED' &&
      tokenisation.tokenisation_status === 'TOKENISED'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tokenisation', 'tokenisation_status'],
        message: 'A redeemed receipt cannot still be tokenised',
      });
    }
  });

export type WarehouseReceipt = z.infer<typeof WarehouseReceiptSchema>;
