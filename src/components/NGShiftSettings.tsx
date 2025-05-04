import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addNGShift, removeNGShift } from '../store/slices/shiftSlice';
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
  gap: 1rem;
  margin-bottom: 1rem;
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

const NGList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NGItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
`;

interface NGShiftSettingsProps {
  onClose: () => void;
}

interface NGShift {
  staffId: string;
  shiftTime: ShiftTime;
  dayOfWeek: number;
}

const NGShiftSettings: React.FC<NGShiftSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { staff, ngShifts } = useSelector((state: RootState) => state.shift);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedShiftTime, setSelectedShiftTime] = useState<ShiftTime>(Object.keys(SHIFT_TIMES)[0] as ShiftTime);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);

  const dayOfWeekNames = ['日', '月', '火', '水', '木', '金', '土'];

  const handleAddNGShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff && selectedShiftTime) {
      dispatch(addNGShift({
        staffId: selectedStaff,
        shiftTime: selectedShiftTime,
        dayOfWeek: selectedDayOfWeek
      }));
    }
  };

  const handleRemoveNGShift = (staffId: string, shiftTime: ShiftTime, dayOfWeek: number) => {
    dispatch(removeNGShift({ staffId, shiftTime, dayOfWeek }));
  };

  return (
    <Container>
      <h2>NGシフト設定</h2>
      <Form onSubmit={handleAddNGShift}>
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

        <Select
          value={selectedShiftTime}
          onChange={(e) => setSelectedShiftTime(e.target.value as ShiftTime)}
          required
        >
          {Object.keys(SHIFT_TIMES).map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </Select>

        <Select
          value={selectedDayOfWeek}
          onChange={(e) => setSelectedDayOfWeek(Number(e.target.value))}
          required
        >
          {dayOfWeekNames.map((day, index) => (
            <option key={index} value={index}>{day}曜日</option>
          ))}
        </Select>

        <Button type="submit">追加</Button>
      </Form>

      <NGList>
        {ngShifts.map((ng: NGShift, index: number) => {
          const staffMember = staff.find(s => s.id === ng.staffId);
          return (
            <NGItem key={index}>
              <span>
                {staffMember?.name} - {ng.shiftTime} - {dayOfWeekNames[ng.dayOfWeek]}曜日
              </span>
              <Button
                className="delete"
                onClick={() => handleRemoveNGShift(ng.staffId, ng.shiftTime, ng.dayOfWeek)}
              >
                削除
              </Button>
            </NGItem>
          );
        })}
      </NGList>
    </Container>
  );
};

export default NGShiftSettings; 