import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid, Select, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const MaintenanceModal = ({ open, onClose, maintenance, buses, mechanics, onSave }) => {
  const [formData, setFormData] = useState({
    bus_id: '',
    description: '',
    type: 'scheduled',
    mechanic_id: '',
    date: new Date(),
    cost: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        bus_id: maintenance.bus_id,
        description: maintenance.description,
        type: maintenance.type,
        mechanic_id: maintenance.mechanic_id,
        date: new Date(maintenance.date),
        cost: maintenance.cost || '',
        status: maintenance.status,
        notes: maintenance.notes || ''
      });
    } else {
      setFormData({
        bus_id: '',
        description: '',
        type: 'scheduled',
        mechanic_id: '',
        date: new Date(),
        cost: '',
        status: 'pending',
        notes: ''
      });
    }
  }, [maintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: maintenance?.id
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1
      }}>
        <Typography variant="h6" mb={3}>
          {maintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Bus</InputLabel>
                <Select
                  name="bus_id"
                  value={formData.bus_id}
                  onChange={handleChange}
                  required
                  label="Bus"
                >
                  {buses.map(bus => (
                    <MenuItem key={bus.id} value={bus.id}>
                      {bus.registration_number} - {bus.model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  label="Type"
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="preventive">Preventive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Mechanic</InputLabel>
                <Select
                  name="mechanic_id"
                  value={formData.mechanic_id}
                  onChange={handleChange}
                  required
                  label="Mechanic"
                >
                  {mechanics.map(mechanic => (
                    <MenuItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default MaintenanceModal;