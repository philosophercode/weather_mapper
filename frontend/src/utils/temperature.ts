/**
 * Convert temperature from Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert temperature from Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert temperature to the target unit
 */
export function convertTemperature(
  temperature: number,
  fromUnit: 'C' | 'F',
  toUnit: 'C' | 'F'
): number {
  if (fromUnit === toUnit) {
    return temperature;
  }
  if (fromUnit === 'C' && toUnit === 'F') {
    return celsiusToFahrenheit(temperature);
  }
  return fahrenheitToCelsius(temperature);
}

/**
 * Format temperature with unit
 */
export function formatTemperature(temperature: number, unit: 'C' | 'F'): string {
  return `${Math.round(temperature)}°${unit}`;
}

