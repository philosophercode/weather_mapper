import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TemperatureUnit = 'C' | 'F';

interface UnitContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  setUnit: (unit: TemperatureUnit) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

const STORAGE_KEY = 'weather_mapper_temperature_unit';

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    // Get from localStorage or default to Celsius
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as TemperatureUnit) || 'C';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const setUnit = (newUnit: TemperatureUnit) => {
    setUnitState(newUnit);
  };

  const toggleUnit = () => {
    setUnitState((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
}

