import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, MenuItem, FormControl, 
  InputLabel, Select, IconButton, Avatar, Badge 
} from '@mui/material';
import { 
  Add, Edit, Delete, AssignmentInd, 
  Event, VerifiedUser, Warning 
} from '@mui/icons-material';

const InspectorsManagement = () => {
  const { user } = useAuth();
  const [inspectors, setInspectors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInspector, setCurrentInspector] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    badgeNumber: '',
    certification: '',
    specialization: 'safety',
    status: 'active',
    lastInspectionDate: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockInspectors = [
      { 
        id: 1, 
        name: 'Michael Brown', 
        badgeNumber: 'INSP-001', 
        certification: 'Advanced Safety Inspector', 
        specialization: 'safety', 
        status: 'active', 
        lastInspectionDate: '2023-05-10',
        avatar: 'MB'
      },
      { 
        id: 2, 
        name: 'Sarah Wilson', 
        badgeNumber: 'INSP-002', 
        certification: 'Vehicle Condition Specialist', 
        specialization: 'condition', 
        status: 'training', 
        lastInspectionDate: '2023-04-28',
        avatar: 'SW'
      }
    ];
    setInspectors(mockInspectors);
  }, []);

  const handleOpenDialog = (inspector = null) => {
    if (inspector) {
      setCurrentInspector(inspector);
      setFormData(inspector);
    } else {
      setCurrentInspector(null);
      setFormData({
        name: '',
        badgeNumber: '',
        certification: '',
        specialization: 'safety',
        status: 'active',
        lastInspectionDate: ''
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
    if (currentInspector) {
      // Update existing inspector
      setInspectors(inspectors.map(inspector => 
        inspector.id === currentInspector.id ? formData : inspector
      ));
    } else {
      // Add new inspector
      const newInspector = {
        ...formData,
        id: inspectors.length + 1,
        avatar: formData.name.split(' ').map(n => n[0]).join('')
      };
      setInspectors([...inspectors, newInspector]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setInspectors(inspectors.filter(inspector => inspector.id !== id));
  };

  const filteredInspectors = inspectors.filter(inspector =>
    inspector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspector.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUser fontSize="large" /> Inspectors Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Inspector
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Inspectors"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inspector</TableCell>
              <TableCell>Badge Number</TableCell>
              <TableCell>Certification</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Last Inspection</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInspectors.map((inspector) => (
              <TableRow key={inspector.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{inspector.avatar}</Avatar>
                    {inspector.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Badge badgeContent={inspector.status === 'active' ? 'Active' : null} color="success">
                    {inspector.badgeNumber}
                  </Badge>
                </TableCell>
                <TableCell>{inspector.certification}</TableCell>
                <TableCell>
                  {inspector.specialization === 'safety' ? 'Safety' : 'Vehicle Condition'}
                </TableCell>
                <TableCell>{inspector.lastInspectionDate}</TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 
                        inspector.status === 'active' ? 'success.light' :
                        inspector.status === 'training' ? 'warning.light' : 'error.light',
                      color: 'white'
                    }}
                  >
                    {inspector.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(inspector)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(inspector.id)}>
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
          {currentInspector ? 'Edit Inspector' : 'Add New Inspector'}
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
              label="Badge Number"
              name="badgeNumber"
              value={formData.badgeNumber}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Certification"
              name="certification"
              value={formData.certification}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Specialization</InputLabel>
              <Select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                label="Specialization"
              >
                <MenuItem value="safety">Safety Inspection</MenuItem>
                <MenuItem value="condition">Vehicle Condition</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="training">In Training</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Last Inspection Date"
              name="lastInspectionDate"
              type="date"
              value={formData.lastInspectionDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentInspector ? 'Update' : 'Add'} Inspector
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InspectorsManagement;