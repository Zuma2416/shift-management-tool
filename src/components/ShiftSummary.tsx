import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ShiftTime, SHIFT_TIMES } from '../types';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  padding: 0.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.5rem;
  border: 1px solid #ddd;
`;

interface ShiftSummaryProps {
  year: number;
  month: number;
}

interface ShiftCount {
  [key: string]: {
    [key in ShiftTime]: number;
  };
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({ year, month }) => {
  const { staff, patterns } = useSelector((state: RootState) => state.shift);

  const getMonthlyShiftCounts = () => {
    const counts: ShiftCount = {};

    staff.forEach(s => {
      counts[s.id] = Object.keys(SHIFT_TIMES).reduce((acc, time) => ({
        ...acc,
        [time]: 0
      }), {} as { [key in ShiftTime]: number });
    });

    patterns.forEach(pattern => {
      const patternDate = new Date(pattern.date);
      if (patternDate.getFullYear() === year && patternDate.getMonth() === month - 1) {
        counts[pattern.staffId][pattern.shiftTime]++;
      }
    });

    return counts;
  };

  const shiftCounts = getMonthlyShiftCounts();

  const getTotalShifts = (staffId: string) => {
    return Object.values(shiftCounts[staffId]).reduce((sum, count) => sum + count, 0);
  };

  return (
    <Container>
      <h2>{year}年{month}月の勤務集計</h2>
      <Table>
        <thead>
          <tr>
            <Th>職員名</Th>
            {Object.keys(SHIFT_TIMES).map(time => (
              <Th key={time}>{time}</Th>
            ))}
            <Th>合計</Th>
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <Td>{s.name}</Td>
              {Object.keys(SHIFT_TIMES).map(time => (
                <Td key={time}>{shiftCounts[s.id][time as ShiftTime]}</Td>
              ))}
              <Td>{getTotalShifts(s.id)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShiftSummary; 