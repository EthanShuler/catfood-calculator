export type WeightUnit = 'kg' | 'lbs';
export type Gender = 'male' | 'female';
export type SpayNeuterStatus = 'intact' | 'neutered';
export type WeightStatus = 'underweight' | 'ideal' | 'overweight';
export type FoodType = 'wet' | 'dry';
export type AgeUnit = 'months' | 'years';

export interface CatInput {
  weight: number;
  weightUnit: WeightUnit;
  gender: Gender;
  spayNeuterStatus: SpayNeuterStatus;
  age: number;
  ageUnit: AgeUnit;
  weightStatus: WeightStatus;
  idealWeight?: number; // Used for weight loss/gain calculations
  idealWeightUnit?: WeightUnit;
}

export interface FoodDensity {
  type: 'kcalPerCan' | 'kcalPerKg' | 'kcalPerCup';
  value: number;
}

export interface FoodInput {
  name: string;
  foodType: FoodType;
  energyDensity: FoodDensity;
}

export interface CalculationResult {
  rer: number;
  multiplier: number;
  multiplierReason: string;
  dailyCalories: number;
  foodAmounts: FoodAmount[];
}

export interface FoodAmount {
  foodName: string;
  foodType: FoodType;
  calories: number;
  amount: {
    cans?: number;
    grams?: number;
    cups?: number;
  };
}
