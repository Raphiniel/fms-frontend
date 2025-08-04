import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { DirectionsBus, Receipt, Build, Warning, InfoOutline, MoneyOutlined, MonetizationOn, PeopleAltTwoTone } from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/alerts')
        ]);
        setStats(statsRes.data);
        setAlerts(alertsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DirectionsBus sx={{ fontSize: 40, mr: 2 }} color="primary" />
                <Box>
                  <Typography variant="h6">Active Buses</Typography>
                  <Typography variant="h4">{stats?.active_buses || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt sx={{ fontSize: 40, mr: 2 }} color="success" />
                <Box>
                  <Typography variant="h6">Today's Revenue</Typography>
                  <Typography variant="h4">${stats?.today_revenue?.toFixed(2) || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Build sx={{ fontSize: 40, mr: 2 }} color="warning" />
                <Box>
                  <Typography variant="h6">Pending Maintenance</Typography>
                  <Typography variant="h4">{stats?.pending_maintenance || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning sx={{ fontSize: 40, mr: 2 }} color="error" />
                <Box>
                  <Typography variant="h6">Active Alerts</Typography>
                  <Typography variant="h4">{alerts.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonetizationOn sx={{ fontSize: 40, mr: 2 }} color="error" />
                <Box>
                  <Typography variant="h6">Accounting</Typography>
                  <Typography variant="h4">{alerts.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleAltTwoTone sx={{ fontSize: 40, mr: 2 }} color="error" />
                <Box>
                  <Typography variant="h6">HR</Typography>
                  <Typography variant="h4">{alerts.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {alerts.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Alerts
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {alerts.map((alert, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent>
                  <Typography color={alert.severity === 'high' ? 'error' : 'warning'}>
                    {alert.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(alert.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;