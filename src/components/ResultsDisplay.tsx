import { Stack, Title, Text, Table, Paper, Slider, Group, Divider, Badge } from '@mantine/core';
import { useState } from 'react';
import type { CalculationResult } from '../types';

interface ResultsDisplayProps {
  result: CalculationResult;
  onSplitChange?: (splitPercent: number) => void;
}

export function ResultsDisplay({ result, onSplitChange }: ResultsDisplayProps) {
  const [splitPercent, setSplitPercent] = useState(50);
  const hasTwoFoods = result.foodAmounts.length === 2;

  const handleSliderChange = (value: number) => {
    setSplitPercent(value);
    if (onSplitChange) {
      onSplitChange(value);
    }
  };

  const formatAmount = (amount: { cans?: number; cups?: number; grams?: number }) => {
    const parts: string[] = [];
    if (amount.cans !== undefined) {
      parts.push(`${amount.cans.toFixed(2)} cans`);
    }
    if (amount.cups !== undefined) {
      parts.push(`${amount.cups.toFixed(2)} cups`);
    }
    if (amount.grams !== undefined) {
      parts.push(`${amount.grams.toFixed(1)} g`);
    }
    return parts.join(' / ');
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="lg">
        <Title order={3}>Results</Title>

        {/* Calculation Summary */}
        <Paper p="md" withBorder bg="gray.0">
          <Stack gap="xs">
            <Group justify="apart">
              <Text fw={500}>RER (Resting Energy Requirement):</Text>
              <Badge size="lg" variant="light">
                {result.rer.toFixed(0)} kcal/day
              </Badge>
            </Group>
            <Group justify="apart">
              <Text fw={500}>Multiplier:</Text>
              <Badge size="lg" variant="light">
                {result.multiplier.toFixed(1)}x
              </Badge>
            </Group>
            <Group justify="apart">
              <Text size="sm" c="dimmed">
                Reason:
              </Text>
              <Text size="sm" c="dimmed">
                {result.multiplierReason}
              </Text>
            </Group>
            <Divider my="xs" />
            <Group justify="apart">
              <Text fw={700} size="lg">
                Daily Calorie Target:
              </Text>
              <Badge size="xl" variant="filled">
                {result.dailyCalories.toFixed(0)} kcal/day
              </Badge>
            </Group>
          </Stack>
        </Paper>

        {/* Two Foods Slider */}
        {hasTwoFoods && (
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Text fw={500}>Adjust Food Split</Text>
              <Slider
                value={splitPercent}
                onChange={handleSliderChange}
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
                label={(value) => `${value}%`}
              />
              <Group justify="apart">
                <Text size="sm" c="dimmed">
                  {result.foodAmounts[0]?.foodName || 'Food 1'}: {splitPercent}%
                </Text>
                <Text size="sm" c="dimmed">
                  {result.foodAmounts[1]?.foodName || 'Food 2'}: {100 - splitPercent}%
                </Text>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Food Amounts Table */}
        <div>
          <Title order={4} mb="md">
            Daily Food Amounts
          </Title>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Food Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Calories</Table.Th>
                <Table.Th>Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.foodAmounts.map((food, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Text fw={500}>{food.foodName || `Food ${index + 1}`}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{food.foodType}</Badge>
                  </Table.Td>
                  <Table.Td>{food.calories.toFixed(0)} kcal</Table.Td>
                  <Table.Td>
                    <Text>{formatAmount(food.amount)}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Paper>
  );
}
