import type { FoodInput, FoodAmount } from '../types';

// Standard cup to gram conversion for dry cat food
const GRAMS_PER_CUP_DRY_FOOD = 120;

/**
 * Calculate the amount of food needed for a given calorie target
 */
export function calculateFoodAmount(food: FoodInput, caloriesNeeded: number): FoodAmount {
  const amount: FoodAmount = {
    foodName: food.name,
    foodType: food.foodType,
    calories: caloriesNeeded,
    amount: {},
  };

  if (food.foodType === 'wet') {
    // Wet food calculations
    if (food.energyDensity.type === 'kcalPerCan') {
      amount.amount.cans = caloriesNeeded / food.energyDensity.value;
    } else if (food.energyDensity.type === 'kcalPerKg') {
      const gramsNeeded = (caloriesNeeded / food.energyDensity.value) * 1000;
      // Assuming standard can size of ~85g (3oz) for conversion display
      amount.amount.cans = gramsNeeded / 85;
      amount.amount.grams = gramsNeeded;
    }
  } else {
    // Dry food calculations
    if (food.energyDensity.type === 'kcalPerCup') {
      amount.amount.cups = caloriesNeeded / food.energyDensity.value;
      amount.amount.grams = amount.amount.cups * GRAMS_PER_CUP_DRY_FOOD;
    } else if (food.energyDensity.type === 'kcalPerKg') {
      amount.amount.grams = (caloriesNeeded / food.energyDensity.value) * 1000;
      amount.amount.cups = amount.amount.grams / GRAMS_PER_CUP_DRY_FOOD;
    }
  }

  return amount;
}

/**
 * Calculate food amounts for one or two foods based on calorie split
 * @param foods Array of 1 or 2 foods
 * @param totalCalories Total daily calorie target
 * @param splitPercent Percentage of calories for first food (0-100), only used if 2 foods
 */
export function calculateFoodAmounts(
  foods: FoodInput[],
  totalCalories: number,
  splitPercent: number = 50
): FoodAmount[] {
  if (foods.length === 0) {
    return [];
  }

  if (foods.length === 1) {
    return [calculateFoodAmount(foods[0], totalCalories)];
  }

  // Two foods: split calories based on percentage
  const food1Calories = (totalCalories * splitPercent) / 100;
  const food2Calories = totalCalories - food1Calories;

  return [
    calculateFoodAmount(foods[0], food1Calories),
    calculateFoodAmount(foods[1], food2Calories),
  ];
}
