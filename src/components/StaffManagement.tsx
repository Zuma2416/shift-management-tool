import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useShift } from '../contexts/ShiftContext';

export default function StaffManagement() {
  const { staff, addStaff, removeStaff, updateStaff } = useShift();
  const [newStaffName, setNewStaffName] = useState('');
  const [editingStaff, setEditingStaff] = useState<{ id: string; name: string } | null>(null);

  const handleAddStaff = () => {
    if (newStaffName.trim()) {
      addStaff(newStaffName.trim());
      setNewStaffName('');
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingStaff({ id, name });
  };

  const handleSaveEdit = () => {
    if (editingStaff) {
      updateStaff(editingStaff.id, editingStaff.name);
      setEditingStaff(null);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        職員管理
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          size="small"
          label="職員名"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddStaff()}
        />
        <Button
          variant="contained"
          onClick={handleAddStaff}
          disabled={!newStaffName.trim()}
        >
          追加
        </Button>
      </Box>

      <List>
        {staff.map((s) => (
          <ListItem
            key={s.id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleStartEdit(s.id, s.name)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeStaff(s.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            {editingStaff?.id === s.id ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  value={editingStaff.name}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, name: e.target.value })
                  }
                />
                <IconButton onClick={handleSaveEdit}>
                  <SaveIcon />
                </IconButton>
              </Box>
            ) : (
              <ListItemText primary={s.name} />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 