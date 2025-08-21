import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, IconButton, Chip } from '@mui/material';
import { Add, Edit, Delete, Inventory } from '@mui/icons-material';
import PartModal from '../components/parts/PartModal';

const Parts = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await api.get('/parts');
        setParts(response.data);
      } catch (error) {
        console.error('Error fetching parts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  const handleOpenModal = (part = null) => {
    setCurrentPart(part);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentPart(null);
  };

  const handleSavePart = async (partData) => {
    try {
      if (partData.id) {
        await api.put(`/parts/${partData.id}`, partData);
      } else {
        await api.post('/parts', partData);
      }
      const response = await api.get('/parts');
      setParts(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving part:', error);
    }
  };

  const handleDeletePart = async (id) => {
    try {
      await api.delete(`/parts/${id}`);
      setParts(parts.filter(part => part.id !== id));
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  const categories = [...new Set(parts.map(part => part.category))];

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         part.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? part.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
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
          <Inventory sx={{ verticalAlign: 'middle', mr: 1 }} />
          Spare Parts Inventory
        </Typography>
        {['admin', 'fleet_manager', 'owner', 'workshop'].includes(user?.role) && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Part
          </Button>
        )}
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Parts"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.name}</TableCell>
                <TableCell>{part.serial_number}</TableCell>
                <TableCell>{part.category}</TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell>{part.threshold}</TableCell>
                <TableCell>
                  <Chip 
                    label={part.quantity <= part.threshold ? 'Low Stock' : 'In Stock'} 
                    color={part.quantity <= part.threshold ? 'error' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(part)}>
                    <Edit color="primary" />
                  </IconButton>
                  {['admin', 'fleet_manager', 'owner'].includes(user?.role) && (
                    <IconButton onClick={() => handleDeletePart(part.id)}>
                      <Delete color="error" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PartModal
        open={openModal}
        onClose={handleCloseModal}
        part={currentPart}
        onSave={handleSavePart}
      />
    </Box>
  );
};

export default Parts;