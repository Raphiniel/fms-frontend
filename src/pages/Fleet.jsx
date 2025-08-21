import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, IconButton } from '@mui/material';
import { Add, Edit, Delete, DirectionsBus } from '@mui/icons-material';
import BusModal from '../components/fleet/BusModal';

const Fleet = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await api.get('/fleet/buses');
        setBuses(response.data);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleOpenModal = (bus = null) => {
    setCurrentBus(bus);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentBus(null);
  };

  const handleSaveBus = async (busData) => {
    try {
      if (busData.id) {
        await api.put(`/fleet/buses/${busData.id}`, busData);
      } else {
        await api.post('/fleet/buses', busData);
      }
      const response = await api.get('/fleet/buses');
      setBuses(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      await api.delete(`/fleet/buses/${id}`);
      setBuses(buses.filter(bus => bus.id !== id));
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  const filteredBuses = buses.filter(bus => 
    bus.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <DirectionsBus sx={{ verticalAlign: 'middle', mr: 1 }} />
          Fleet Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Add Bus
        </Button>
      </Box>

      <TextField
        label="Search Buses"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>Next Service</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBuses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell>{bus.registration_number}</TableCell>
                <TableCell>{bus.model}</TableCell>
                <TableCell>{bus.capacity}</TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: bus.status === 'active' ? 'success.light' : 'error.light',
                      color: 'white'
                    }}
                  >
                    {bus.status}
                  </Box>
                </TableCell>
                <TableCell>{bus.mileage} km</TableCell>
                <TableCell>
                  {bus.next_service_mileage && (
                    <Box 
                      component="span" 
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: bus.mileage >= bus.next_service_mileage - 500 ? 'warning.light' : 'info.light',
                        color: 'white'
                      }}
                    >
                      {bus.next_service_mileage} km
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(bus)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBus(bus.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BusModal
        open={openModal}
        onClose={handleCloseModal}
        bus={currentBus}
        onSave={handleSaveBus}
      />
    </Box>
  );
};

export default Fleet;