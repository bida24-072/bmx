# GGDS Field Mapping

This table maps every field in the BMX `WarehouseReceipt` schema to the
specific DMCC Global Good Delivery Standard (GGDS) requirement it satisfies.

| GGDS Requirement | Schema Location | Field(s) |
|---|---|---|
| Unique receipt identification | `identification` | `receipt_id`, `receipt_number` |
| Receipt type (negotiable status) | `identification` | `receipt_type` |
| Issuance date | `identification` | `issuance_date` |
| Depositor identity | `parties.depositor` | `depositor_id`, `depositor_legal_name`, `depositor_national_id` |
| Depositor contact | `parties.depositor.depositor_contact` | `phone`, `email`, `physical_address` |
| Warehouse operator identity | `parties.warehouse_operator` | `warehouse_operator_id`, `warehouse_operator_legal_name` |
| Warehouse operator accreditation | `parties.warehouse_operator` | `warehouse_operator_licence` |
| Current holder | `parties.current_holder` | `current_holder_id`, `current_holder_type` |
| Third-party claims disclosure | `parties.third_party_claims` | Full array |
| Commodity category | `commodity` | `commodity_category` |
| Commodity type | `commodity` | `commodity_type` |
| Standardised grade | `commodity` | `commodity_grade` |
| Quantity | `commodity` | `quantity`, `unit_of_measure` |
| Quality parameters | `commodity` | `quality_parameters` |
| Independent inspection certificate | `commodity` | `quality_inspection_certificate`, `quality_inspection_date` |
| Origin — district/region | `origin` | `origin_district` |
| Origin — GPS coordinates | `origin` | `origin_coordinates` |
| Harvest / extraction date | `origin` | `harvest_or_extraction_date` |
| Producer classification | `origin` | `producer_type` |
| Sustainability certifications | `origin` | `sustainability_certifications` |
| Economic impact (ethics) | `origin` | `economic_impact_data` |
| Chain of custody | `origin` | `chain_of_custody` |
| Vault identity and location | `vault` | `vault_id`, `vault_location` |
| Storage location detail | `vault` | `storage_location_detail` |
| Storage start date | `vault` | `storage_start_date` |
| Storage fee tariff | `vault` | `storage_fee_rate` |
| Insurance | `vault` | `insurance_policy_number`, `insured_value` |
| Storage conditions | `vault` | `vault_conditions` |
| GGDS certification status | `vault` | `ggds_certification_status` |
| GGDS certificate number | `vault` | `ggds_certificate_number` |
| Reference valuation | `valuation` | `reference_price`, `reference_price_currency`, `reference_price_date` |
| Collateral coefficient | `valuation` | `collateral_valuation_coefficient` |
| Digital signature (operator) | `audit` | `digital_signature`, `signature_algorithm` |
| Immutable audit trail | `audit` | `audit_log`, `document_hash` |

## Notes

- **UNCITRAL alignment:** Fields marked with `*` map directly to the UNCITRAL
  Model Law on Warehouse Receipts minimum content requirements.
- **Tradeflow Warrant:** The `vault.ggds_certificate_number` is the reference
  to the underlying Tradeflow Warrant issued under DMCC rules.
- **Cross-border producers:** `origin.origin_district` accepts SADC country
  and region names to support Malawi, Zambia, and other corridor producers.
