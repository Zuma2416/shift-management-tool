import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useShift } from '../contexts/ShiftContext';

const shiftTypes = {
  morning: { label: '朝番', time: '7:00-16:00' },
  day: { label: '日勤', time: '8:30-17:30' },
  evening: { label: '遅番', time: '10:00-19:00' },
  night: { label: '夜勤', time: '16:00-翌10:00' },
  nightAfter: { label: '夜勤明け', time: '夜勤明け' },
  nightSupport: { label: '夜勤補助', time: '16:00-22:00' },
};

export default function ShiftCalendar() {
  const { staff, shifts, updateShift } = useShift();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleShiftChange = (date: Date, staffId: string, shiftType: string) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const currentShifts = shifts[dateKey] || [];
    
    // Remove existing shift for this staff member
    const filteredShifts = currentShifts.filter(s => s.staffId !== staffId);
    
    // Add new shift if one was selected
    if (shiftType) {
      filteredShifts.push({
        staffId,
        shiftType: shiftType as keyof typeof shiftTypes,
      });
    }

    updateShift(dateKey, filteredShifts);
  };

  const renderDayCell = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayShifts = shifts[dateKey] || [];

    return (
      <Box
        sx={{
          p: 1,
          height: '100%',
          minHeight: 120,
          border: '1px solid #ddd',
          bgcolor: isWeekend(date) ? '#f5f5f5' : 'white',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: date.getDay() === 0 ? 'error.main' : date.getDay() === 6 ? 'primary.main' : 'inherit',
            textAlign: 'right',
            mb: 1,
          }}
        >
          {format(date, 'd')}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(shiftTypes).map(([type, { label }]) => (
            <FormControl key={type} size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={dayShifts.find(s => s.shiftType === type)?.staffId || ''}
                onChange={(e) => handleShiftChange(date, e.target.value as string, type)}
                label={label}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {staff.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          type="month"
          value={format(selectedDate, 'yyyy-MM')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          sx={{ width: 200 }}
        />
        <Button
          variant="contained"
          onClick={() => setSelectedDate(new Date())}
        >
          今月
        </Button>
      </Box>

      <Grid container spacing={0}>
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <Grid item xs key={day}>
            <Box
              sx={{
                p: 1,
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              {day}
            </Box>
          </Grid>
        ))}
        
        {days.map((date) => (
          <Grid item xs key={format(date, 'yyyy-MM-dd')}>
            {renderDayCell(date)}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
} 