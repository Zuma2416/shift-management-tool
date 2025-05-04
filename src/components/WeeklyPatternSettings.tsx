import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addWeeklyPattern, removeWeeklyPattern } from '../store/slices/shiftSlice';
import { ShiftTime, SHIFT_TIMES } from '../types';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }

  &.delete {
    background: #f44336;
    &:hover {
      background: #e53935;
    }
  }
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
`;

const DayCell = styled.div`
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
`;

const PatternList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PatternItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
`;

interface WeeklyPatternSettingsProps {
  onClose: () => void;
}

interface WeeklyPattern {
  staffId: string;
  pattern: (ShiftTime | null)[];
  name: string;
}

const WeeklyPatternSettings: React.FC<WeeklyPatternSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { staff, weeklyPatterns } = useSelector((state: RootState) => state.shift);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [patternName, setPatternName] = useState('');
  const [weekPattern, setWeekPattern] = useState<(ShiftTime | null)[]>(Array(7).fill(null));

  const dayOfWeekNames = ['日', '月', '火', '水', '木', '金', '土'];

  const handleShiftChange = (dayIndex: number, shiftTime: ShiftTime | '') => {
    const newPattern = [...weekPattern];
    newPattern[dayIndex] = shiftTime === '' ? null : shiftTime as ShiftTime;
    setWeekPattern(newPattern);
  };

  const handleAddPattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff && patternName) {
      dispatch(addWeeklyPattern({
        staffId: selectedStaff,
        pattern: weekPattern,
        name: patternName
      }));
      setPatternName('');
      setWeekPattern(Array(7).fill(null));
    }
  };

  const handleRemovePattern = (staffId: string, name: string) => {
    dispatch(removeWeeklyPattern({ staffId, name }));
  };

  return (
    <Container>
      <h2>週単位パターン設定</h2>
      <Form onSubmit={handleAddPattern}>
        <Select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          required
        >
          <option value="">職員を選択</option>
          {staff.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>

        <input
          type="text"
          value={patternName}
          onChange={(e) => setPatternName(e.target.value)}
          placeholder="パターン名"
          required
        />

        <WeekGrid>
          {dayOfWeekNames.map((day, index) => (
            <DayCell key={index}>
              <div>{day}</div>
              <Select
                value={weekPattern[index] || ''}
                onChange={(e) => handleShiftChange(index, e.target.value as ShiftTime | '')}
              >
                <option value="">選択なし</option>
                {Object.keys(SHIFT_TIMES).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Select>
            </DayCell>
          ))}
        </WeekGrid>

        <Button type="submit">パターンを追加</Button>
      </Form>

      <PatternList>
        {weeklyPatterns?.map((pattern: WeeklyPattern, index: number) => {
          const staffMember = staff.find(s => s.id === pattern.staffId);
          return (
            <PatternItem key={index}>
              <div>
                <strong>{staffMember?.name}</strong> - {pattern.name}
                <div>
                  {pattern.pattern.map((shift, dayIndex) => (
                    <span key={dayIndex}>
                      {dayOfWeekNames[dayIndex]}: {shift || '休み'}{' '}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                className="delete"
                onClick={() => handleRemovePattern(pattern.staffId, pattern.name)}
              >
                削除
              </Button>
            </PatternItem>
          );
        })}
      </PatternList>
    </Container>
  );
};

export default WeeklyPatternSettings; 