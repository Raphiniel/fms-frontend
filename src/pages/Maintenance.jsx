import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, IconButton, Select, MenuItem, Chip } from '@mui/material';
import { Add, Edit, Delete, Build, Check, Close } from '@mui/icons-material';
import MaintenanceModal from '../components/maintenance/MaintenanceModal';

const Maintenance = () => {
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState([]);
  const [buses, setBuses] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenanceRes, busesRes, mechanicsRes] = await Promise.all([
          api.get('/maintenance'),
          api.get('/fleet/buses'),
          api.get('/users/mechanics')
        ]);
        setMaintenance(maintenanceRes.data);
        setBuses(busesRes.data);
        setMechanics(mechanicsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (record = null) => {
    setCurrentMaintenance(record);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentMaintenance(null);
  };

  const handleSaveMaintenance = async (maintenanceData) => {
    try {
      if (maintenanceData.id) {
        await api.put(`/maintenance/${maintenanceData.id}`, maintenanceData);
      } else {
        await api.post('/maintenance', maintenanceData);
      }
      const response = await api.get('/maintenance');
      setMaintenance(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving maintenance record:', error);
    }
  };

  const handleDeleteMaintenance = async (id) => {
    try {
      await api.delete(`/maintenance/${id}`);
      setMaintenance(maintenance.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
    }
  };

  const handleCompleteMaintenance = async (id) => {
    try {
      await api.patch(`/maintenance/${id}/complete`);
      const response = await api.get('/maintenance');
      setMaintenance(response.data);
    } catch (error) {
      console.error('Error completing maintenance:', error);
    }
  };

  const filteredMaintenance = maintenance.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBus = busFilter ? record.bus_id === parseInt(busFilter) : true;
    const matchesStatus = statusFilter ? record.status === statusFilter : true;
    return matchesSearch && matchesBus && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Build sx={{ verticalAlign: 'middle', mr: 1 }} />
          Maintenance Management
        </Typography>
        {['admin', 'fleet_manager', 'owner', 'workshop'].includes(user?.role) && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Record
          </Button>
        )}
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Maintenance"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={busFilter}
          onChange={(e) => setBusFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Buses</MenuItem>
          {buses.map(bus => (
            <MenuItem key={bus.id} value={bus.id}>
              {bus.registration_number}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Mechanic</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaintenance.map((record) => {
              const bus = buses.find(b => b.id === record.bus_id);
              const mechanic = mechanics.find(m => m.id === record.mechanic_id);
              
              return (
                <TableRow key={record.id}>
                  <TableCell>{bus?.registration_number || 'N/A'}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.type.replace('_', ' ')} 
                      color={
                        record.type === 'scheduled' ? 'primary' :
                        record.type === 'emergency' ? 'error' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>{mechanic?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${record.cost?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status.replace('_', ' ')} 
                      color={
                        record.status === 'completed' ? 'success' :
                        record.status === 'in_progress' ? 'info' :
                        record.status === 'cancelled' ? 'error' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(record)}>
                      <Edit color="primary" />
                    </IconButton>
                    {['admin', 'fleet_manager', 'owner'].includes(user?.role) && (
                      <IconButton onClick={() => handleDeleteMaintenance(record.id)}>
                        <Delete color="error" />
                      </IconButton>
                    )}
                    {['workshop', 'admin', 'fleet_manager', 'owner'].includes(user?.role) && 
                      record.status !== 'completed' && (
                        <IconButton 
                          onClick={() => handleCompleteMaintenance(record.id)}
                          color="success"
                        >
                          <Check />
                        </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <MaintenanceModal
        open={openModal}
        onClose={handleCloseModal}
        maintenance={currentMaintenance}
        buses={buses}
        mechanics={mechanics}
        onSave={handleSaveMaintenance}
      />
    </Box>
  );
};

export default Maintenance;