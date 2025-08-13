import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, MenuItem, FormControl, 
  InputLabel, Select, IconButton 
} from '@mui/material';
import { Add, Edit, Delete, Person, Group } from '@mui/icons-material';

const HrManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'driver',
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockEmployees = [
      { id: 1, name: 'John Driver', email: 'john@fms.com', role: 'driver', status: 'active', hireDate: '2023-01-15' },
      { id: 2, name: 'Sarah Conductor', email: 'sarah@fms.com', role: 'conductor', status: 'active', hireDate: '2023-02-20' },
      { id: 3, name: 'Mike Inspector', email: 'mike@fms.com', role: 'inspector', status: 'on-leave', hireDate: '2022-11-10' }
    ];
    setEmployees(mockEmployees);
  }, []);

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData(employee);
    } else {
      setCurrentEmployee(null);
      setFormData({
        name: '',
        email: '',
        role: 'driver',
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0]
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
    if (currentEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? formData : emp
      ));
    } else {
      // Add new employee
      const newEmployee = {
        ...formData,
        id: employees.length + 1
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Group fontSize="large" /> HR Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Employee
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Employees"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 
                        employee.role === 'driver' ? 'primary.light' :
                        employee.role === 'conductor' ? 'secondary.light' :
                        employee.role === 'inspector' ? 'info.light' : 'grey.300',
                      color: 'white'
                    }}
                  >
                    {employee.role}
                  </Box>
                </TableCell>
                <TableCell>{employee.status}</TableCell>
                <TableCell>{employee.hireDate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(employee)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee.id)}>
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
          {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="driver">Driver</MenuItem>
                <MenuItem value="conductor">Conductor</MenuItem>
                <MenuItem value="inspector">Inspector</MenuItem>
                <MenuItem value="mechanic">Maintenance</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentEmployee ? 'Update' : 'Add'} Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HrManagement;