import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const Controls = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ControlPanel: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <PanelContainer>
      <Controls>
        <MonthSelector>
          <Button onClick={handlePreviousMonth}>前月</Button>
          <h2 style={{ margin: 0 }}>{formatMonth(currentDate)}</h2>
          <Button onClick={handleNextMonth}>次月</Button>
        </MonthSelector>
        <Button onClick={() => window.print()}>印刷</Button>
      </Controls>
    </PanelContainer>
  );
};

export default ControlPanel; 