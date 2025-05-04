import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Staff, ShiftPattern, Template, ShiftTime } from '../../types';

interface NGShift {
  staffId: string;
  shiftTime: ShiftTime;
  dayOfWeek: number;
}

interface WeeklyPattern {
  staffId: string;
  pattern: (ShiftTime | null)[];
  name: string;
}

interface ShiftState {
  staff: Staff[];
  patterns: ShiftPattern[];
  templates: Template[];
  ngShifts: NGShift[];
  weeklyPatterns: WeeklyPattern[];
}

const initialState: ShiftState = {
  staff: [],
  patterns: [],
  templates: [],
  ngShifts: [],
  weeklyPatterns: [],
};

const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    addStaff: (state, action: PayloadAction<Staff>) => {
      state.staff.push(action.payload);
    },
    removeStaff: (state, action: PayloadAction<string>) => {
      state.staff = state.staff.filter(s => s.id !== action.payload);
      state.patterns = state.patterns.filter(p => p.staffId !== action.payload);
      state.ngShifts = state.ngShifts.filter(ng => ng.staffId !== action.payload);
      state.weeklyPatterns = state.weeklyPatterns.filter(wp => wp.staffId !== action.payload);
    },
    addPattern: (state, action: PayloadAction<ShiftPattern>) => {
      state.patterns.push(action.payload);
    },
    removePattern: (state, action: PayloadAction<{ staffId: string; date: Date }>) => {
      state.patterns = state.patterns.filter(
        p => !(p.staffId === action.payload.staffId && p.date.getTime() === action.payload.date.getTime())
      );
    },
    addTemplate: (state, action: PayloadAction<Template>) => {
      state.templates.push(action.payload);
    },
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(t => t.id !== action.payload);
    },
    applyTemplate: (state, action: PayloadAction<{ templateId: string; startDate: Date }>) => {
      const template = state.templates.find(t => t.id === action.payload.templateId);
      if (template) {
        state.patterns = [...state.patterns, ...template.patterns];
      }
    },
    addNGShift: (state, action: PayloadAction<NGShift>) => {
      state.ngShifts.push(action.payload);
    },
    removeNGShift: (state, action: PayloadAction<NGShift>) => {
      state.ngShifts = state.ngShifts.filter(
        ng => !(
          ng.staffId === action.payload.staffId &&
          ng.shiftTime === action.payload.shiftTime &&
          ng.dayOfWeek === action.payload.dayOfWeek
        )
      );
    },
    addWeeklyPattern: (state, action: PayloadAction<WeeklyPattern>) => {
      state.weeklyPatterns.push(action.payload);
    },
    removeWeeklyPattern: (state, action: PayloadAction<{ staffId: string; name: string }>) => {
      state.weeklyPatterns = state.weeklyPatterns.filter(
        wp => !(wp.staffId === action.payload.staffId && wp.name === action.payload.name)
      );
    },
    applyWeeklyPattern: (state, action: PayloadAction<{ staffId: string; name: string; startDate: Date }>) => {
      const pattern = state.weeklyPatterns.find(
        wp => wp.staffId === action.payload.staffId && wp.name === action.payload.name
      );
      if (pattern) {
        const startDate = new Date(action.payload.startDate);
        pattern.pattern.forEach((shiftTime, dayIndex) => {
          if (shiftTime) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + dayIndex);
            state.patterns.push({
              staffId: pattern.staffId,
              date,
              shiftTime
            });
          }
        });
      }
    },
    undo: (state) => {
      state.patterns.pop();
    },
  },
});

export const {
  addStaff,
  removeStaff,
  addPattern,
  removePattern,
  addTemplate,
  removeTemplate,
  applyTemplate,
  addNGShift,
  removeNGShift,
  addWeeklyPattern,
  removeWeeklyPattern,
  applyWeeklyPattern,
  undo,
} = shiftSlice.actions;

export default shiftSlice.reducer; 