import { NumberInput, Select, Stack, Title, Group, Radio, Paper } from '@mantine/core';
import type { CatInput, WeightUnit, Gender, SpayNeuterStatus, WeightStatus, AgeUnit } from '../types';

interface CatInputFormProps {
  cat: CatInput;
  onChange: (cat: CatInput) => void;
}

export function CatInputForm({ cat, onChange }: CatInputFormProps) {
  const updateCat = (updates: Partial<CatInput>) => {
    onChange({ ...cat, ...updates });
  };

  const needsIdealWeight = cat.weightStatus === 'overweight' || cat.weightStatus === 'underweight';

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Cat Information</Title>

        <Group grow>
          <NumberInput
            label="Weight"
            value={cat.weight}
            onChange={(value) => updateCat({ weight: Number(value) || 0 })}
            min={0}
            step={0.1}
            decimalScale={1}
            required
          />
          <Select
            label="Unit"
            value={cat.weightUnit}
            onChange={(value) => updateCat({ weightUnit: value as WeightUnit })}
            data={[
              { value: 'kg', label: 'kg' },
              { value: 'lbs', label: 'lbs' },
            ]}
            required
          />
        </Group>

        <Select
          label="Gender"
          value={cat.gender}
          onChange={(value) => updateCat({ gender: value as Gender })}
          data={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          required
        />

        <Radio.Group
          label="Spay/Neuter Status"
          value={cat.spayNeuterStatus}
          onChange={(value) => updateCat({ spayNeuterStatus: value as SpayNeuterStatus })}
        >
          <Group mt="xs">
            <Radio value="neutered" label="Neutered" />
            <Radio value="intact" label="Intact" />
          </Group>
        </Radio.Group>

        <Group grow>
          <NumberInput
            label="Age"
            value={cat.age}
            onChange={(value) => updateCat({ age: Number(value) || 0 })}
            min={0}
            step={1}
            required
          />
          <Select
            label="Unit"
            value={cat.ageUnit}
            onChange={(value) => updateCat({ ageUnit: value as AgeUnit })}
            data={[
              { value: 'months', label: 'Months' },
              { value: 'years', label: 'Years' },
            ]}
            required
          />
        </Group>

        <Select
          label="Weight Status"
          value={cat.weightStatus}
          onChange={(value) => updateCat({ weightStatus: value as WeightStatus })}
          data={[
            { value: 'underweight', label: 'Underweight' },
            { value: 'ideal', label: 'Ideal' },
            { value: 'overweight', label: 'Overweight' },
          ]}
          required
        />

        {needsIdealWeight && (
          <Group grow>
            <NumberInput
              label="Ideal Weight"
              value={cat.idealWeight}
              onChange={(value) => updateCat({ idealWeight: Number(value) || 0 })}
              min={0}
              step={0.1}
              decimalScale={1}
              description="Used for weight loss/gain calculations"
              required
            />
            <Select
              label="Unit"
              value={cat.idealWeightUnit || cat.weightUnit}
              onChange={(value) => updateCat({ idealWeightUnit: value as WeightUnit })}
              data={[
                { value: 'kg', label: 'kg' },
                { value: 'lbs', label: 'lbs' },
              ]}
              required
            />
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
