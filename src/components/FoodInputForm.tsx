import { TextInput, Select, Stack, Title, Paper, SegmentedControl, NumberInput } from '@mantine/core';
import type { FoodInput, FoodType } from '../types';

interface FoodInputFormProps {
  foods: FoodInput[];
  onChange: (foods: FoodInput[]) => void;
}

interface FoodCardProps {
  food: FoodInput;
  index: number;
  updateFood: (index: number, updates: Partial<FoodInput>) => void;
}

function FoodCard({ food, index, updateFood }: FoodCardProps) {
  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Title order={4}>Food {index + 1}</Title>

        <TextInput
          label="Food Name"
          value={food.name}
          onChange={(e) => updateFood(index, { name: e.target.value })}
          placeholder={`Food ${index + 1}`}
        />

        <SegmentedControl
          value={food.foodType}
          onChange={(value) => {
            const foodType = value as FoodType;
            updateFood(index, {
              foodType,
              energyDensity: {
                type: foodType === 'wet' ? 'kcalPerCan' : 'kcalPerCup',
                value: food.energyDensity.value,
              },
            });
          }}
          data={[
            { value: 'wet', label: 'Wet' },
            { value: 'dry', label: 'Dry' },
          ]}
          fullWidth
        />

        <Select
          label="Energy Density Type"
          value={food.energyDensity.type}
          onChange={(value) =>
            updateFood(index, {
              energyDensity: {
                type: value as 'kcalPerCan' | 'kcalPerCup' | 'kcalPerKg',
                value: food.energyDensity.value,
              },
            })
          }
          data={
            food.foodType === 'wet'
              ? [
                  { value: 'kcalPerCan', label: 'kcal per can' },
                  { value: 'kcalPerKg', label: 'kcal per kg' },
                ]
              : [
                  { value: 'kcalPerCup', label: 'kcal per cup' },
                  { value: 'kcalPerKg', label: 'kcal per kg' },
                ]
          }
          required
        />

        <NumberInput
          label={`Energy Density (${food.energyDensity.type.replace('kcal', 'kcal ')})`}
          value={food.energyDensity.value}
          onChange={(value) =>
            updateFood(index, {
              energyDensity: {
                type: food.energyDensity.type,
                value: Number(value) || 0,
              },
            })
          }
          min={0}
          step={1}
          required
        />
      </Stack>
    </Paper>
  );
}

export function FoodInputForm({ foods, onChange }: FoodInputFormProps) {
  const numFoods = foods.length;

  const setNumFoods = (num: number) => {
    if (num === 1 && foods.length > 1) {
      onChange([foods[0]]);
    } else if (num === 2 && foods.length === 1) {
      onChange([
        foods[0],
        {
          name: '',
          foodType: 'dry',
          energyDensity: { type: 'kcalPerCup', value: 0 },
        },
      ]);
    }
  };

  const updateFood = (index: number, updates: Partial<FoodInput>) => {
    const newFoods = [...foods];
    newFoods[index] = { ...newFoods[index], ...updates };
    onChange(newFoods);
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Food Information</Title>

        <SegmentedControl
          value={String(numFoods)}
          onChange={(value) => setNumFoods(Number(value))}
          data={[
            { value: '1', label: '1 Food' },
            { value: '2', label: '2 Foods' },
          ]}
          fullWidth
        />

        {foods.map((food, index) => (
          <FoodCard key={index} food={food} index={index} updateFood={updateFood} />
        ))}
      </Stack>
    </Paper>
  );
}
