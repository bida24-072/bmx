# FinX Tokenisation Specification

How a BMX `WarehouseReceipt` becomes a tradeable Real World Asset (RWA)
on the DMCC FinX platform.

## Tokenisation Trigger

A receipt becomes eligible for tokenisation when ALL of the following hold:

1. `identification.status` ∈ {`ISSUED`, `PLEDGED`, `PARTIALLY_PLEDGED`}
2. `vault.ggds_certification_status` = `CERTIFIED`
3. `identification.receipt_type` = `NEGOTIABLE`
4. `commodity.quantity` ≥ the minimum parcel size for the commodity class
5. No unresolved `parties.third_party_claims`

## Derived Token Fields

| Token Field | Derivation |
|---|---|
| `token_id` | `sha256(receipt_id || token_contract_address)` |
| `token_standard` | `ERC-3643` (default) or `FINX-NATIVE` for sovereign instruments |
| `token_supply` | `commodity.quantity / tokenised_parcel_size` |
| `token_price_per_unit` | `valuation.reference_price / token_supply` |
| `tokenised_parcel_size` | Commodity-class minimum (see table below) |

## Minimum Parcel Sizes

| Commodity Category | Minimum Parcel | Rationale |
|---|---|---|
| AGRICULTURAL | 1,000 KG | SADC grain trading unit |
| PRECIOUS_METALS | 1 TROY_OZ | LBMA / DMCC standard bar fraction |
| BASE_METALS | 1 MT | LME-aligned |
| ENERGY | 1 BBL | Industry standard |
| LIVESTOCK | 1 HEAD | Botswana BMC unit |
| CRITICAL_MINERALS | 1 KG | Cobalt / lithium concentrate norm |

## Shariah Compliance

For a token to carry `shariah_compliance_flag: true`, it must:

1. Not represent debt (`pledge.pledge_status` ≠ `PLEDGED`)
2. Be backed by a tangible, identified commodity (`origin.chain_of_custody` non-empty)
3. Have a defined delivery mechanism (`vault.storage_location_detail` present)
4. Not involve prohibited (haram) commodities (alcohol, pork, conventional finance)

The flag is advisory — the final determination is made by the Shariah
supervisory board of the issuing financial institution.

## VARA Compliance (Dubai Virtual Assets Regulatory Authority)

Any token listed on FinX must satisfy:

- **KYC/AML:** All token holders pass VARA-compliant onboarding
  (`token_holder_eligibility.requires_kyc` = true)
- **Jurisdictional controls:** `allowed_jurisdictions` and
  `restricted_jurisdictions` are enforced at the smart-contract level
- **Redemption guarantee:** Every token is redeemable for the underlying
  physical commodity at the BMX Gaborone vault
- **Audit trail:** The `audit.audit_log` is anchored on-chain for
  immutable provenance

## Token Lifecycle
