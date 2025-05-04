import React, { useState } from 'react';
import { Paper, Grid, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useShift } from '../contexts/ShiftContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

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

const ShiftCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { staff, shifts } = useShift();

  const days = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <DatePicker
          views={['year', 'month']}
          value={selectedDate}
          onChange={(newValue) => newValue && setSelectedDate(newValue)}
          label="年月を選択"
        />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {format(selectedDate, 'yyyy年M月', { locale: ja })}のシフト表
            </Typography>
          </Grid>
          {days.map((day) => (
            <Grid item xs={12} key={day.toISOString()}>
              <Paper sx={{ p: 1 }}>
                <Typography>
                  {format(day, 'M/d (E)', { locale: ja })}
                </Typography>
                {staff.map((s: Staff) => {
                  const shift = shifts.find(
                    (sh: Shift) => sh.staffId === s.id && sh.date === format(day, 'yyyy-MM-dd')
                  );
                  return (
                    <Box key={s.id} sx={{ ml: 2 }}>
                      {s.name}: {shift?.shiftType || '未設定'}
                    </Box>
                  );
                })}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ShiftCalendar; 