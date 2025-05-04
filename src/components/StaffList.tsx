import React, { useState } from 'react';
import styled from 'styled-components';
import { Staff } from '../types';

const StaffListContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const StaffForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StaffInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
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

const StaffTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f8f8;
  }
`;

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaffName, setNewStaffName] = useState('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaffName.trim()) {
      const newStaff: Staff = {
        id: Date.now().toString(),
        name: newStaffName.trim()
      };
      setStaffList([...staffList, newStaff]);
      setNewStaffName('');
    }
  };

  const handleRemoveStaff = (id: string) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  return (
    <StaffListContainer>
      <h2>職員名簿</h2>
      <StaffForm onSubmit={handleAddStaff}>
        <StaffInput
          type="text"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          placeholder="職員名を入力"
        />
        <Button type="submit">追加</Button>
      </StaffForm>

      <StaffTable>
        <thead>
          <tr>
            <th>名前</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(staff => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>
                <Button
                  onClick={() => handleRemoveStaff(staff.id)}
                  style={{ backgroundColor: '#f44336' }}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </StaffTable>
    </StaffListContainer>
  );
};

export default StaffList; 