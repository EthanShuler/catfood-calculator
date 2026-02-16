---
applyTo: '**'
---

## Project Overview
This project is a **cat food nutrition calculator** that estimates daily caloric needs and converts them into practical feeding amounts for one or two foods.

The calculator must be **deterministic, transparent, and unit-safe**. Prefer clear formulas over hardcoded values.

---

## Core Concepts

### RER (Resting Energy Requirement)
- RER is based on **body weight**
- Use the provided reference table as the **authoritative source**

| Body weight (lbs) | Body weight (kg) | RER (calories per day) |
|------------------:|-----------------:|----------------------:|
| 1  | 0.5  | 39  |
| 2  | 0.9  | 65  |
| 3  | 1.4  | 88  |
| 4  | 1.8  | 110 |
| 5  | 2.3  | 130 |
| 6  | 2.7  | 149 |
| 7  | 3.2  | 167 |
| 8  | 3.6  | 184 |
| 9  | 4.1  | 200 |
| 10 | 4.5  | 218 |
| 11 | 5.0  | 234 |
| 12 | 5.5  | 250 |
| 13 | 5.9  | 265 |
| 14 | 6.4  | 280 |
| 15 | 6.8  | 295 |
| 16 | 7.3  | 310 |
| 17 | 7.7  | 324 |
| 18 | 8.2  | 339 |
| 19 | 8.6  | 353 |
| 20 | 9.1  | 366 |
| 25 | 11.4 | 433 |

- If weight does not exactly match the table:
  - **Interpolate linearly** between the two closest values
  - Do not extrapolate beyond the table unless explicitly handled

---

## Cat Inputs
- Weight (accept **kg or lbs**, normalize internally to kg)
- Gender (male / female)
- Spay / neuter status (intact / neutered)
- Age (months or years)
- Weight status:
  - underweight
  - ideal
  - overweight

---

## Food Inputs
- Number of foods (1 or 2)
- For each food:
  - Name
  - Wet or dry
  - Energy density provided as **one of**:
    - kcal per can (wet)
    - kcal per kg
    - kcal per cup (dry)

Assumptions:
- Wet food cans may be fractional unless otherwise specified
- Dry food supports grams and cups
- Use grams as the internal unit for dry food calculations

---

## Energy Need Multipliers
After computing RER, multiply by **exactly one** factor:

| Condition | Multiplier |
|---------|------------|
| Neutered adult cat | 1.2 × RER |
| Intact adult cat | 1.4 × RER |
| Inactive / obesity-prone cat | 1.0 × RER |
| Weight loss | 0.8 × RER (based on ideal weight) |
| Weight gain | 1.8 × RER (based on ideal weight) |
| Kitten (0–4 months) | 2.5 × RER |
| Kitten (4–12 months) | 2.0 × RER |

Rules:
- Kitten logic overrides neuter/intact logic
- Weight-loss and weight-gain calculations use **ideal weight**, not current weight

---

## Outputs

### Required Outputs
- Recommended **daily calories**
- Recommended **daily food amount**
  - If 1 food: full amount
  - If 2 foods: split calories proportionally
- Display food quantities as:
  - Dry food: cups **and** grams
  - Wet food: cans (fractional allowed)

---

## Interactive Behavior
- When 2 foods are selected:
  - Provide a slider to adjust calorie split
  - Slider range: 0–100% (Food A vs Food B)
  - Calories and food quantities update live

---

## Validation & UX Rules
- Reject missing or contradictory inputs
- Display unit conversions explicitly
- Always show:
  - RER
  - Multiplier used
  - Final calorie target
- Prefer readable math over compact one-liners
- Never silently guess units or food density

---

## Non-Goals
- No medical advice or diagnosis
- No breed-specific logic
- No automatic food recommendations

---

## UI Framework: Mantine v8

- Use **Mantine v8** components exclusively for UI
- Do not mix with other UI frameworks (e.g. MUI, Chakra, Ant)
- Prefer Mantine primitives over custom HTML where possible

### Core Component Usage
Use the following Mantine v8 components by default:

- Layout:
  - `AppShell`
  - `Container`
  - `Stack`
  - `Group`
  - `Grid`
  - `Paper`
  - `Divider`

- Inputs:
  - `NumberInput`
  - `TextInput`
  - `Select`
  - `SegmentedControl`
  - `Radio`
  - `Switch`
  - `Slider`

- Display:
  - `Text`
  - `Title`
  - `Badge`
  - `Table`
  - `Alert`
  - `Tooltip`

### Forms & State
- Prefer **controlled inputs**
- Use `useForm` from `@mantine/form` for validation and state management
- Validation should be explicit and user-visible

### Units & Sliders
- Use `Slider` for:
  - Calorie split between two foods
- Slider values must:
  - Be numeric
  - Display current percentage
  - Update calculated outputs live

### Accessibility & UX
- Always provide labels for inputs
- Use `Tooltip` or helper text for unit explanations
- Display errors inline using Mantine’s built-in error handling
- Avoid hidden or implicit behavior

### Styling
- Use Mantine’s default theme and spacing tokens
- Avoid hardcoded colors and spacing values
- Use `Stack` and `Group` instead of manual margins where possible

### Tables
- Use Mantine’s `Table` component
- Column headers must include units (e.g. kg, kcal/day)

---


