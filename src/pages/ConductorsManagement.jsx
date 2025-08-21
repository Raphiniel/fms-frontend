import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, MenuItem, FormControl, 
  InputLabel, Select, IconButton, Avatar, Chip 
} from '@mui/material';
import { 
  Add, Edit, Delete, Person, 
  Event, DirectionsBus, Work 
} from '@mui/icons-material';

const ConductorsManagement = () => {
  const { user } = useAuth();
  const [conductors, setConductors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentConductor, setCurrentConductor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    assignedRoute: '',
    status: 'active',
    hireDate: '',
    contactNumber: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockConductors = [
      { 
        id: 1, 
        name: 'David Wilson', 
        employeeId: 'CON-001', 
        assignedRoute: 'City Center - Suburb', 
        status: 'active', 
        hireDate: '2022-06-15',
        contactNumber: '+263773456789',
        avatar: 'DW'
      },
      { 
        id: 2, 
        name: 'Grace Moyo', 
        employeeId: 'CON-002', 
        assignedRoute: 'Downtown Express', 
        status: 'on-leave', 
        hireDate: '2023-01-10',
        contactNumber: '+263774567890',
        avatar: 'GM'
      }
    ];
    setConductors(mockConductors);
  }, []);

  const handleOpenDialog = (conductor = null) => {
    if (conductor) {
      setCurrentConductor(conductor);
      setFormData(conductor);
    } else {
      setCurrentConductor(null);
      setFormData({
        name: '',
        employeeId: '',
        assignedRoute: '',
        status: 'active',
        hireDate: '',
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
    if (currentConductor) {
      // Update existing conductor
      setConductors(conductors.map(conductor => 
        conductor.id === currentConductor.id ? formData : conductor
      ));
    } else {
      // Add new conductor
      const newConductor = {
        ...formData,
        id: conductors.length + 1,
        avatar: formData.name.split(' ').map(n => n[0]).join('')
      };
      setConductors([...conductors, newConductor]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setConductors(conductors.filter(conductor => conductor.id !== id));
  };

  const filteredConductors = conductors.filter(conductor =>
    conductor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conductor.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person fontSize="large" /> Conductors Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Conductor
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Conductors"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Conductor</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Assigned Route</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConductors.map((conductor) => (
              <TableRow key={conductor.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{conductor.avatar}</Avatar>
                    {conductor.name}
                  </Box>
                </TableCell>
                <TableCell>{conductor.employeeId}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsBus color="action" />
                    {conductor.assignedRoute}
                  </Box>
                </TableCell>
                <TableCell>{conductor.hireDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={conductor.status} 
                    color={
                      conductor.status === 'active' ? 'success' :
                      conductor.status === 'on-leave' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{conductor.contactNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(conductor)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(conductor.id)}>
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
          {currentConductor ? 'Edit Conductor' : 'Add New Conductor'}
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
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Assigned Route"
              name="assignedRoute"
              value={formData.assignedRoute}
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
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Hire Date"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
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
            {currentConductor ? 'Update' : 'Add'} Conductor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConductorsManagement;