// RER (Resting Energy Requirement) table - authoritative source
const RER_TABLE = [
  { lbs: 1, kg: 0.5, rer: 39 },
  { lbs: 2, kg: 0.9, rer: 65 },
  { lbs: 3, kg: 1.4, rer: 88 },
  { lbs: 4, kg: 1.8, rer: 110 },
  { lbs: 5, kg: 2.3, rer: 130 },
  { lbs: 6, kg: 2.7, rer: 149 },
  { lbs: 7, kg: 3.2, rer: 167 },
  { lbs: 8, kg: 3.6, rer: 184 },
  { lbs: 9, kg: 4.1, rer: 200 },
  { lbs: 10, kg: 4.5, rer: 218 },
  { lbs: 11, kg: 5.0, rer: 234 },
  { lbs: 12, kg: 5.5, rer: 250 },
  { lbs: 13, kg: 5.9, rer: 265 },
  { lbs: 14, kg: 6.4, rer: 280 },
  { lbs: 15, kg: 6.8, rer: 295 },
  { lbs: 16, kg: 7.3, rer: 310 },
  { lbs: 17, kg: 7.7, rer: 324 },
  { lbs: 18, kg: 8.2, rer: 339 },
  { lbs: 19, kg: 8.6, rer: 353 },
  { lbs: 20, kg: 9.1, rer: 366 },
  { lbs: 25, kg: 11.4, rer: 433 },
];

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Calculate RER based on weight in kg
 * Uses linear interpolation between table values
 */
export function calculateRER(weightKg: number): number {
  // Check if weight is below minimum
  if (weightKg <= RER_TABLE[0].kg) {
    return RER_TABLE[0].rer;
  }

  // Check if weight is above maximum
  if (weightKg >= RER_TABLE[RER_TABLE.length - 1].kg) {
    return RER_TABLE[RER_TABLE.length - 1].rer;
  }

  // Find the two closest values for interpolation
  for (let i = 0; i < RER_TABLE.length - 1; i++) {
    const lower = RER_TABLE[i];
    const upper = RER_TABLE[i + 1];

    if (weightKg >= lower.kg && weightKg <= upper.kg) {
      // Linear interpolation
      const ratio = (weightKg - lower.kg) / (upper.kg - lower.kg);
      return lower.rer + ratio * (upper.rer - lower.rer);
    }
  }

  // Fallback (should not reach here)
  return RER_TABLE[0].rer;
}
