import { useState, useMemo } from 'react';
import { Container, Stack, Title, Text, Alert, Group } from '@mantine/core';
import type { CatInput, FoodInput } from './types';
import { CatInputForm } from './components/CatInputForm';
import { FoodInputForm } from './components/FoodInputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { calculateRER } from './utils/rer';
import { getEnergyMultiplier, getWeightForRER } from './utils/energy';
import { calculateFoodAmounts } from './utils/food';

function App() {
  const [cat, setCat] = useState<CatInput>({
    weight: 10,
    weightUnit: 'lbs',
    gender: 'male',
    spayNeuterStatus: 'neutered',
    age: 3,
    ageUnit: 'years',
    weightStatus: 'ideal',
  });

  const [foods, setFoods] = useState<FoodInput[]>([
    {
      name: 'Dry Food',
      foodType: 'dry',
      energyDensity: { type: 'kcalPerCup', value: 400 },
    },
  ]);

  const [splitPercent, setSplitPercent] = useState(50);

  const { result, error } = useMemo(() => {
    try {
      // Validate inputs
      if (cat.weight <= 0) {
        return { result: null, error: 'Cat weight must be greater than 0' };
      }

      if (cat.age <= 0) {
        return { result: null, error: 'Cat age must be greater than 0' };
      }

      if ((cat.weightStatus === 'overweight' || cat.weightStatus === 'underweight') && !cat.idealWeight) {
        return { result: null, error: 'Ideal weight is required for overweight or underweight cats' };
      }

      if (foods.some((f) => !f.name)) {
        return { result: null, error: 'All foods must have a name' };
      }

      if (foods.some((f) => f.energyDensity.value <= 0)) {
        return { result: null, error: 'All foods must have energy density greater than 0' };
      }

      // Calculate RER
      const weightKg = getWeightForRER(cat);
      const rer = calculateRER(weightKg);

      // Get multiplier
      const { multiplier, reason } = getEnergyMultiplier(cat);

      // Calculate daily calories
      const dailyCalories = rer * multiplier;

      // Calculate food amounts
      const foodAmounts = calculateFoodAmounts(foods, dailyCalories, splitPercent);

      return {
        result: {
          rer,
          multiplier,
          multiplierReason: reason,
          dailyCalories,
          foodAmounts,
        },
        error: '',
      };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [cat, foods, splitPercent]);

  const handleSplitChange = (newSplit: number) => {
    setSplitPercent(newSplit);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Cat Food Nutrition Calculator
          </Title>
          <Text c="dimmed">
            Calculate daily caloric needs and feeding amounts for your cat
          </Text>
        </div>

        {error && (
          <Alert color="red" title="Validation Error">
            {error}
          </Alert>
        )}

        <CatInputForm cat={cat} onChange={setCat} />

        <FoodInputForm foods={foods} onChange={setFoods} />

        {result && <ResultsDisplay result={result} onSplitChange={handleSplitChange} />}
      </Stack>
    </Container>
  );
}

export default App;
