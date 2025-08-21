import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid, Select, FormControl, InputLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

const TripModal = ({ open, onClose, trip, buses, conductors, onSave }) => {
  const [formData, setFormData] = useState({
    route: '',
    bus_id: '',
    conductor_id: '',
    departure_time: new Date(),
    arrival_time: null,
    revenue: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        route: trip.route,
        bus_id: trip.bus_id,
        conductor_id: trip.conductor_id,
        departure_time: new Date(trip.departure_time),
        arrival_time: trip.arrival_time ? new Date(trip.arrival_time) : null,
        revenue: trip.revenue || '',
        status: trip.status,
        notes: trip.notes || ''
      });
    } else {
      setFormData({
        route: '',
        bus_id: '',
        conductor_id: '',
        departure_time: new Date(),
        arrival_time: null,
        revenue: '',
        status: 'scheduled',
        notes: ''
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: trip?.id
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
          {trip ? 'Edit Trip' : 'Add New Trip'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            
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
                <InputLabel>Conductor</InputLabel>
                <Select
                  name="conductor_id"
                  value={formData.conductor_id}
                  onChange={handleChange}
                  required
                  label="Conductor"
                >
                  {conductors.map(conductor => (
                    <MenuItem key={conductor.id} value={conductor.id}>
                      {conductor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Departure Time"
                value={formData.departure_time}
                onChange={(value) => handleDateTimeChange('departure_time', value)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Arrival Time"
                value={formData.arrival_time}
                onChange={(value) => handleDateTimeChange('arrival_time', value)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Revenue"
                name="revenue"
                type="number"
                value={formData.revenue}
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
                  <MenuItem value="scheduled">Scheduled</MenuItem>
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

export default TripModal;