import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid } from '@mui/material';

const BusModal = ({ open, onClose, bus, onSave }) => {
  const [formData, setFormData] = useState({
    registration_number: '',
    model: '',
    capacity: '',
    status: 'active',
    mileage: '',
    next_service_mileage: '',
    purchase_date: '',
    insurance_expiry: ''
  });

  useEffect(() => {
    if (bus) {
      setFormData({
        registration_number: bus.registration_number,
        model: bus.model,
        capacity: bus.capacity,
        status: bus.status,
        mileage: bus.mileage,
        next_service_mileage: bus.next_service_mileage,
        purchase_date: bus.purchase_date,
        insurance_expiry: bus.insurance_expiry
      });
    } else {
      setFormData({
        registration_number: '',
        model: '',
        capacity: '',
        status: 'active',
        mileage: '',
        next_service_mileage: '',
        purchase_date: '',
        insurance_expiry: ''
      });
    }
  }, [bus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: bus?.id
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1
      }}>
        <Typography variant="h6" mb={3}>
          {bus ? 'Edit Bus' : 'Add New Bus'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Mileage (km)"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next Service at (km)"
                name="next_service_mileage"
                type="number"
                value={formData.next_service_mileage}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchase Date"
                name="purchase_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.purchase_date}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Insurance Expiry"
                name="insurance_expiry"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.insurance_expiry}
                onChange={handleChange}
                margin="normal"
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

export default BusModal;