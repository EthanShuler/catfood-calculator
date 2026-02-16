import type { CatInput } from '../types';
import { lbsToKg } from './rer';

/**
 * Determine the energy multiplier and reason based on cat characteristics
 */
export function getEnergyMultiplier(cat: CatInput): { multiplier: number; reason: string } {
  const ageInMonths = cat.ageUnit === 'years' ? cat.age * 12 : cat.age;

  // Kitten logic overrides neuter/intact logic
  if (ageInMonths < 4) {
    return {
      multiplier: 2.5,
      reason: 'Kitten (0-4 months)',
    };
  }

  if (ageInMonths >= 4 && ageInMonths < 12) {
    return {
      multiplier: 2.0,
      reason: 'Kitten (4-12 months)',
    };
  }

  // Weight loss/gain calculations use ideal weight
  if (cat.weightStatus === 'overweight') {
    return {
      multiplier: 0.8,
      reason: 'Weight loss (based on ideal weight)',
    };
  }

  if (cat.weightStatus === 'underweight') {
    return {
      multiplier: 1.8,
      reason: 'Weight gain (based on ideal weight)',
    };
  }

  // Adult cat logic based on spay/neuter status
  if (cat.spayNeuterStatus === 'neutered') {
    return {
      multiplier: 1.2,
      reason: 'Neutered adult cat',
    };
  }

  return {
    multiplier: 1.4,
    reason: 'Intact adult cat',
  };
}

/**
 * Get the weight to use for RER calculation
 * Weight loss uses ideal weight, weight gain uses current weight, otherwise uses current weight
 */
export function getWeightForRER(cat: CatInput): number {
  let weightKg: number;

  // For weight loss, use ideal weight (target lower weight)
  // For weight gain, use current weight (gradually increase calories as they gain)
  if (cat.weightStatus === 'overweight' && cat.idealWeight) {
    weightKg = cat.idealWeightUnit === 'lbs' ? lbsToKg(cat.idealWeight) : cat.idealWeight;
  } else {
    weightKg = cat.weightUnit === 'lbs' ? lbsToKg(cat.weight) : cat.weight;
  }

  return weightKg;
}
