import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addPattern, removePattern } from '../store/slices/shiftSlice';
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
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StaffList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const StaffCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

interface BulkShiftInputProps {
  onClose: () => void;
}

const BulkShiftInput: React.FC<BulkShiftInputProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { staff } = useSelector((state: RootState) => state.shift);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shiftTime, setShiftTime] = useState<ShiftTime>(Object.keys(SHIFT_TIMES)[0] as ShiftTime);

  const handleStaffToggle = (staffId: string) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff.length > 0 && startDate && endDate && shiftTime) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (const staffId of selectedStaff) {
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          dispatch(addPattern({
            staffId,
            date: new Date(date),
            shiftTime
          }));
        }
      }

      setSelectedStaff([]);
      setStartDate('');
      setEndDate('');
      setShiftTime(Object.keys(SHIFT_TIMES)[0] as ShiftTime);
    }
  };

  return (
    <Container>
      <h2>一括シフト入力</h2>
      <Form onSubmit={handleSubmit}>
        <StaffList>
          {staff.map(s => (
            <StaffCheckbox key={s.id}>
              <input
                type="checkbox"
                checked={selectedStaff.includes(s.id)}
                onChange={() => handleStaffToggle(s.id)}
              />
              {s.name}
            </StaffCheckbox>
          ))}
        </StaffList>

        <DateRangeContainer>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <span>から</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <span>まで</span>
        </DateRangeContainer>

        <Select
          value={shiftTime}
          onChange={(e) => setShiftTime(e.target.value as ShiftTime)}
          required
        >
          {Object.keys(SHIFT_TIMES).map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </Select>

        <Button type="submit">一括入力</Button>
      </Form>
    </Container>
  );
};

export default BulkShiftInput; 