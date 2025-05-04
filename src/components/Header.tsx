import React from 'react';
import styled from '@emotion/styled';

const HeaderContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;

  &:hover {
    background: #43a047;
  }
`;

interface HeaderProps {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onStaffManagement: () => void;
  onTemplateManagement: () => void;
  onReset: () => void;
  onPrint: () => void;
}

const Header: React.FC<HeaderProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange,
  onStaffManagement,
  onTemplateManagement,
  onReset,
  onPrint,
}) => {
  return (
    <HeaderContainer>
      <div>
        <Select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) => year - 1 + i).map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </Select>
      </div>

      <div>
        <Select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </Select>
      </div>

      <ActionButton onClick={onStaffManagement}>
        職員管理
      </ActionButton>

      <ActionButton onClick={onTemplateManagement}>
        テンプレート管理
      </ActionButton>

      <ButtonGroup>
        <ActionButton onClick={onReset}>
          リセット
        </ActionButton>
        <ActionButton onClick={onPrint}>
          印刷
        </ActionButton>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header; 