import React, { createContext, useContext, useState, useCallback } from 'react';

interface Staff {
  id: string;
  name: string;
}

interface ShiftEntry {
  staffId: string;
  shiftType: 'morning' | 'day' | 'evening' | 'night' | 'nightAfter' | 'nightSupport';
}

interface DayShifts {
  [key: string]: ShiftEntry[];
}

interface ShiftContextType {
  staff: Staff[];
  addStaff: (name: string) => void;
  removeStaff: (id: string) => void;
  updateStaff: (id: string, name: string) => void;
  shifts: DayShifts;
  updateShift: (date: string, shifts: ShiftEntry[]) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<DayShifts>({});

  const addStaff = useCallback((name: string) => {
    setStaff(prev => [...prev, { id: crypto.randomUUID(), name }]);
  }, []);

  const removeStaff = useCallback((id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateStaff = useCallback((id: string, name: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  }, []);

  const updateShift = useCallback((date: string, newShifts: ShiftEntry[]) => {
    setShifts(prev => ({
      ...prev,
      [date]: newShifts
    }));
  }, []);

  return (
    <ShiftContext.Provider value={{
      staff,
      addStaff,
      removeStaff,
      updateStaff,
      shifts,
      updateShift
    }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
} 