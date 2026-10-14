/**
 * BMX Core — Validation Entry Points
 *
 * Thin wrappers around the Zod schema that return structured results
 * suitable for API responses and CI checks.
 */

import { WarehouseReceiptSchema, type WarehouseReceipt } from '../types/warehouse-receipt.js';

export interface ValidationSuccess {
  valid: true;
  receipt: WarehouseReceipt;
}

export interface ValidationFailure {
  valid: false;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateReceipt(input: unknown): ValidationResult {
  const result = WarehouseReceiptSchema.safeParse(input);

  if (result.success) {
    return { valid: true, receipt: result.data };
  }

  return {
    valid: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })),
  };
}
