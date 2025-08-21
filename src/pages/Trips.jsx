import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, IconButton, Select, MenuItem } from '@mui/material';
import { Add, Edit, Delete, Receipt } from '@mui/icons-material';
import TripModal from '../components/trips/TripModal';

const Trips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, busesRes, conductorsRes] = await Promise.all([
          api.get('/trips'),
          api.get('/fleet/buses'),
          api.get('/users/conductors')
        ]);
        setTrips(tripsRes.data);
        setBuses(busesRes.data);
        setConductors(conductorsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (trip = null) => {
    setCurrentTrip(trip);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentTrip(null);
  };

  const handleSaveTrip = async (tripData) => {
    try {
      if (tripData.id) {
        await api.put(`/trips/${tripData.id}`, tripData);
      } else {
        await api.post('/trips', tripData);
      }
      const response = await api.get('/trips');
      setTrips(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBus = busFilter ? trip.bus_id === parseInt(busFilter) : true;
    const matchesStatus = statusFilter ? trip.status === statusFilter : true;
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
          <Receipt sx={{ verticalAlign: 'middle', mr: 1 }} />
          Trip Management
        </Typography>
        {['admin', 'fleet_manager', 'owner', 'conductor'].includes(user?.role) && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Trip
          </Button>
        )}
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Trips"
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
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Route</TableCell>
              <TableCell>Bus</TableCell>
              <TableCell>Conductor</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrips.map((trip) => {
              const bus = buses.find(b => b.id === trip.bus_id);
              const conductor = conductors.find(c => c.id === trip.conductor_id);
              
              return (
                <TableRow key={trip.id}>
                  <TableCell>{trip.route}</TableCell>
                  <TableCell>{bus?.registration_number || 'N/A'}</TableCell>
                  <TableCell>{conductor?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(trip.departure_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {trip.arrival_time ? new Date(trip.arrival_time).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>${trip.revenue?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Box 
                      component="span" 
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 
                          trip.status === 'completed' ? 'success.light' :
                          trip.status === 'in_progress' ? 'info.light' :
                          trip.status === 'cancelled' ? 'error.light' : 'warning.light',
                        color: 'white'
                      }}
                    >
                      {trip.status.replace('_', ' ')}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(trip)}>
                      <Edit color="primary" />
                    </IconButton>
                    {['admin', 'fleet_manager', 'owner'].includes(user?.role) && (
                      <IconButton onClick={() => handleDeleteTrip(trip.id)}>
                        <Delete color="error" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TripModal
        open={openModal}
        onClose={handleCloseModal}
        trip={currentTrip}
        buses={buses}
        conductors={conductors}
        onSave={handleSaveTrip}
      />
    </Box>
  );
};

export default Trips;