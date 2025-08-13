import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField, Tabs, Tab,
  Card, CardContent, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import { 
  AttachMoney, Receipt, Timeline, Description, 
  FilterList, DateRange, CloudUpload 
} from '@mui/icons-material';

const AccountingManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockTransactions = [
      { id: 1, date: '2023-05-01', description: 'Fuel purchase', amount: 250.75, type: 'expense', category: 'fuel' },
      { id: 2, date: '2023-05-02', description: 'Ticket sales', amount: 1200.50, type: 'income', category: 'tickets' },
      { id: 3, date: '2023-05-03', description: 'Maintenance parts', amount: 450.20, type: 'expense', category: 'maintenance' }
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filter.type === 'all' || transaction.type === filter.type;
    const matchesDateFrom = !filter.dateFrom || transaction.date >= filter.dateFrom;
    const matchesDateTo = !filter.dateTo || transaction.date <= filter.dateTo;
    return matchesType && matchesDateFrom && matchesDateTo;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AttachMoney fontSize="large" /> Accounting Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Transactions" icon={<Receipt />} />
          <Tab label="Reports" icon={<Description />} />
          <Tab label="Analytics" icon={<Timeline />} />
        </Tabs>

        <Button variant="contained" startIcon={<CloudUpload />}>
          Import Transactions
        </Button>
      </Box>

      {tabValue === 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', gap: 3 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filter.type}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expenses</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="From"
                type="date"
                name="dateFrom"
                value={filter.dateFrom}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 180 }}
              />
              <TextField
                label="To"
                type="date"
                name="dateTo"
                value={filter.dateTo}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 180 }}
              />
              <Button variant="outlined" startIcon={<FilterList />}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell sx={{ color: transaction.type === 'income' ? 'success.main' : 'error.main' }}>
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: transaction.type === 'income' ? 'success.light' : 'error.light',
                          color: 'white'
                        }}
                      >
                        {transaction.type}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Financial Reports
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Button variant="contained">Daily Report</Button>
            <Button variant="contained">Weekly Report</Button>
            <Button variant="contained">Monthly Report</Button>
            <Button variant="contained">Annual Report</Button>
          </Box>
          <Typography variant="body1">
            Select a report type to generate detailed financial statements.
          </Typography>
        </Card>
      )}

      {tabValue === 2 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Financial Analytics
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            <Card sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle1">Total Income</Typography>
              <Typography variant="h4" color="success.main">
                ${totalIncome.toFixed(2)}
              </Typography>
            </Card>
            <Card sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle1">Total Expenses</Typography>
              <Typography variant="h4" color="error.main">
                ${totalExpenses.toFixed(2)}
              </Typography>
            </Card>
            <Card sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle1">Net Profit</Typography>
              <Typography variant="h4" color={(totalIncome - totalExpenses) >= 0 ? 'success.main' : 'error.main'}>
                ${(totalIncome - totalExpenses).toFixed(2)}
              </Typography>
            </Card>
          </Box>
          <Typography variant="body1">
            Financial overview and trends visualization will be displayed here.
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default AccountingManagement;