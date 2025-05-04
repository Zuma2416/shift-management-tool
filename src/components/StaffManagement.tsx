import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useShift } from '../contexts/ShiftContext';

const StaffManagement: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useShift();
  const [newStaffName, setNewStaffName] = useState('');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaffName.trim()) {
      addStaff(newStaffName.trim());
      setNewStaffName('');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleAddStaff}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              label="スタッフ名"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={!newStaffName.trim()}>
              追加
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper>
        <List>
          {staff.map((s) => (
            <ListItem key={s.id}>
              <ListItemText primary={s.name} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={s.isActive}
                  onChange={(e) => updateStaff(s.id, { isActive: e.target.checked })}
                />
                <IconButton edge="end" onClick={() => deleteStaff(s.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default StaffManagement; 