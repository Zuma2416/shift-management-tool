import { createContext, useContext, useState, ReactNode } from 'react';

interface Staff {
  id: string;
  name: string;
  isActive: boolean;
}

interface Shift {
  staffId: string;
  date: string;
  shiftType: string;
}

interface ShiftContextType {
  staff: Staff[];
  shifts: Shift[];
  addStaff: (name: string) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  addShift: (shift: Shift) => void;
  updateShift: (staffId: string, date: string, shiftType: string) => void;
  deleteShift: (staffId: string, date: string) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function useShift() {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
}

interface ShiftProviderProps {
  children: ReactNode;
}

export function ShiftProvider({ children }: ShiftProviderProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const addStaff = (name: string) => {
    setStaff(prev => [...prev, { id: crypto.randomUUID(), name, isActive: true }]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setShifts(prev => prev.filter(s => s.staffId !== id));
  };

  const addShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift]);
  };

  const updateShift = (staffId: string, date: string, shiftType: string) => {
    setShifts(prev => {
      const existingShiftIndex = prev.findIndex(s => s.staffId === staffId && s.date === date);
      if (existingShiftIndex >= 0) {
        const newShifts = [...prev];
        newShifts[existingShiftIndex] = { staffId, date, shiftType };
        return newShifts;
      }
      return [...prev, { staffId, date, shiftType }];
    });
  };

  const deleteShift = (staffId: string, date: string) => {
    setShifts(prev => prev.filter(s => !(s.staffId === staffId && s.date === date)));
  };

  const value = {
    staff,
    shifts,
    addStaff,
    updateStaff,
    deleteStaff,
    addShift,
    updateShift,
    deleteShift,
  };

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
} 