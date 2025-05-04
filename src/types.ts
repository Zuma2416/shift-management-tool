export type ShiftTime = '①朝番' | '②日勤' | '③昼番' | '④夜勤' | '⑤夜番' | '⑥夜支援員';

export interface Staff {
  id: string;
  name: string;
}

export interface ShiftEntry {
  staffId: string;
  shiftType: ShiftTime;
  note?: string;
}

export interface DayShifts {
  [key: string]: ShiftEntry[];
}

export interface MonthShifts {
  [date: string]: DayShifts;
}

export interface ShiftPattern {
  staffId: string;
  date: Date;
  shiftTime: ShiftTime;
  isDefault?: boolean;
}

export interface Template {
  id: string;
  name: string;
  patterns: ShiftPattern[];
}

export interface NGShift {
  staffId: string;
  shiftTime: ShiftTime;
  dayOfWeek: number;
}

export interface WeeklyPattern {
  staffId: string;
  pattern: (ShiftTime | null)[];
  name: string;
}

export interface ShiftSummary {
  staffId: string;
  counts: {
    [key in ShiftTime]: number;
  };
  total: number;
}

export interface HistoryEntry {
  timestamp: Date;
  action: 'add' | 'remove' | 'edit';
  data: ShiftPattern;
}

export interface AppState {
  staff: Staff[];
  patterns: ShiftPattern[];
  templates: Template[];
  ngShifts: NGShift[];
  weeklyPatterns: WeeklyPattern[];
  history: HistoryEntry[];
}

export const SHIFT_TIMES: Record<ShiftTime, { start: string; end: string }> = {
  '①朝番': { start: '6:00', end: '11:00' },
  '②日勤': { start: '9:00', end: '18:00' },
  '③昼番': { start: '11:00', end: '16:00' },
  '④夜勤': { start: '16:00', end: '20:00' },
  '⑤夜番': { start: '19:00', end: '22:00' },
  '⑥夜支援員': { start: '22:00', end: '6:00' },
}; 