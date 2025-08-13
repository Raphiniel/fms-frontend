import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, MenuItem, FormControl, 
  InputLabel, Select, IconButton, Chip, Avatar 
} from '@mui/material';
import { 
  Add, Edit, Delete, DirectionsCar, Event, 
  AssignmentInd, Warning, CheckCircle 
} from '@mui/icons-material';

const DriversManagement = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    assignedVehicle: '',
    status: 'active',
    contactNumber: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockDrivers = [
      { 
        id: 1, 
        name: 'John Smith', 
        licenseNumber: 'DL123456', 
        licenseExpiry: '2024-05-15', 
        assignedVehicle: 'BUS-001', 
        status: 'active', 
        contactNumber: '+263771234567',
        avatar: 'JS'
      },
      { 
        id: 2, 
        name: 'Robert Johnson', 
        licenseNumber: 'DL654321', 
        licenseExpiry: '2023-12-10', 
        assignedVehicle: 'BUS-002', 
        status: 'on-leave', 
        contactNumber: '+263772345678',
        avatar: 'RJ'
      }
    ];
    setDrivers(mockDrivers);
  }, []);

  const handleOpenDialog = (driver = null) => {
    if (driver) {
      setCurrentDriver(driver);
      setFormData(driver);
    } else {
      setCurrentDriver(null);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseExpiry: '',
        assignedVehicle: '',
        status: 'active',
        contactNumber: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (currentDriver) {
      // Update existing driver
      setDrivers(drivers.map(driver => 
        driver.id === currentDriver.id ? formData : driver
      ));
    } else {
      // Add new driver
      const newDriver = {
        ...formData,
        id: drivers.length + 1,
        avatar: formData.name.split(' ').map(n => n[0]).join('')
      };
      setDrivers([...drivers, newDriver]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCar fontSize="large" /> Drivers Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Driver
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Drivers"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Driver</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Assigned Vehicle</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{driver.avatar}</Avatar>
                    {driver.name}
                  </Box>
                </TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {driver.licenseExpiry}
                    {new Date(driver.licenseExpiry) < new Date() && (
                      <Warning color="error" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{driver.assignedVehicle}</TableCell>
                <TableCell>
                  <Chip 
                    label={driver.status} 
                    color={
                      driver.status === 'active' ? 'success' :
                      driver.status === 'on-leave' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{driver.contactNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(driver)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(driver.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentDriver ? 'Edit Driver' : 'Add New Driver'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="License Expiry"
              name="licenseExpiry"
              type="date"
              value={formData.licenseExpiry}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Assigned Vehicle"
              name="assignedVehicle"
              value={formData.assignedVehicle}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentDriver ? 'Update' : 'Add'} Driver
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriversManagement;