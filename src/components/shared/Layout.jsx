import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, Avatar, Divider, CssBaseline, 
  useTheme, useMediaQuery, styled
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { 
  Dashboard, DirectionsBus, Receipt, Build, Inventory, Logout, 
<<<<<<< HEAD
  Money, People, Sell, Person2, Person2Outlined, Menu, Map
=======
  Money, People, Sell, Person2, Person2Outlined, Menu 
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid #ffeb3b`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(255, 235, 59, 0.3)',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid #ffeb3b',
    width: 240,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 20px rgba(255, 235, 59, 0.3)',
    },
  },
}));

const StyledNavItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 2),
  width: 'auto',
  position: 'relative',
  transition: 'all 0.2s ease',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 235, 59, 0.1)',
    transform: 'translateX(4px)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      background: '#ffeb3b',
    },
  },
  '&.active': {
    backgroundColor: 'rgba(255, 235, 59, 0.2)',
    borderLeft: `4px solid #ffeb3b`,
    '& .MuiListItemIcon-root': {
      color: '#ffeb3b',
    },
    '& .MuiTypography-root': {
      fontWeight: 'bold',
      color: '#ffeb3b',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      background: '#ffeb3b',
    },
  },
}));

const Layout = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['admin', 'fleet_manager', 'owner', 'accountant', 'workshop', 'conductor', 'inspector'] },
    { text: 'Fleet', icon: <DirectionsBus />, path: '/fleet', roles: ['admin', 'fleet_manager', 'owner'] },
    { text: 'Trips', icon: <Receipt />, path: '/trips', roles: ['admin', 'fleet_manager', 'owner', 'conductor', 'inspector'] },
    { text: 'Maintenance', icon: <Build />, path: '/maintenance', roles: ['admin', 'fleet_manager', 'owner', 'workshop'] },
    { text: 'Stores/Parts', icon: <Inventory />, path: '/parts', roles: ['admin', 'fleet_manager', 'owner', 'workshop'] },
    { text: 'Accounting', icon: <Money />, path: '/accounting', roles: ['admin', 'accountant', 'owner'] },
    { text: 'HR', icon: <People/>, path: '/hr-management', roles: ['admin', 'owner'] },
    { text: 'Drivers', icon: <Person2 />, path: '/drivers', roles: ['admin', 'fleet_manager', 'owner'] },
    { text: 'Inspectors', icon: <Person2Outlined />, path: '/inspectors', roles: ['admin', 'fleet_manager', 'owner'] },
<<<<<<< HEAD
    { text: 'Maps', icon: <Map />, path: '/livemap', roles: ['admin', 'fleet_manager', 'owner'] },
=======
    { text: 'Maps', icon: <Person2Outlined />, path: '/livemap', roles: ['admin', 'fleet_manager', 'owner'] },
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
    { text: 'Conductors', icon: <Sell />, path: '/conductors', roles: ['admin', 'fleet_manager', 'owner'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => user?.role === role)
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Slideshow background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'slideshow 40s infinite',
        opacity: 1,
        transition: 'opacity 5s ease-in-out',
      }} />
      
      <CssBaseline />
      <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <Button 
              color="inherit" 
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                color: '#ffeb3b',
                '&:hover': {
                  backgroundColor: 'rgba(255, 235, 59, 0.2)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Menu />
            </Button>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            <Box component="span" sx={{ 
              color: '#ffeb3b',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}>
            Dromos
            </Box>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: '#ffeb3b', 
              color: 'black',
              width: 36, 
              height: 36,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 10px rgba(255, 235, 59, 0.5)',
              }
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1, color: '#ffeb3b' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 235, 59, 0.7)' }}>
                {user?.role}
              </Typography>
            </Box>
            <Button 
              color="inherit" 
              onClick={logout} 
              startIcon={<Logout sx={{ color: '#ffeb3b' }} />}
              sx={{ 
                ml: 2,
                color: '#ffeb3b',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 235, 59, 0.2)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Logout
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <StyledDrawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Toolbar />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            p: 1
          }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="overline" sx={{ 
                color: '#ffeb3b',
                letterSpacing: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'white',
                }
              }}>
                Navigation
              </Typography>
            </Box>
            <Divider sx={{ 
              my: 1,
              borderColor: 'rgba(255, 235, 59, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#ffeb3b',
              }
            }} />
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
              <List>
                {filteredMenuItems.map((item) => (
                  <StyledNavItem 
                    button 
                    key={item.text}
                    component={NavLink}
                    to={item.path}
                    activeClassName="active"
                    exact
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: 'white',
                      transition: 'all 0.3s ease',
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: 'medium',
                        transition: 'all 0.3s ease',
                      }} 
                    />
                  </StyledNavItem>
                ))}
              </List>
            </Box>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255, 235, 59, 0.7)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ffeb3b',
                }
              }}>
                Dromos 
              </Typography>
            </Box>
          </Box>
        </StyledDrawer>
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar />
        <Box sx={{ 
          borderRadius: 2,
          p: 3,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          border: '1px solid #ffeb3b',
          boxShadow: '0 4px 20px rgba(255, 235, 59, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 30px rgba(255, 235, 59, 0.2)',
          }
        }}>
          <Outlet />
        </Box>
      </Box>

      {/* Add the slideshow animation to the global styles */}
      <style>{`
        @keyframes slideshow {
          0% {
            background-image: url('image/bus1.jpg');
            opacity: 1;
            transition: 3s;
          }
          20% {
            opacity: 1;
            transition: 3s;
          }
          25% {
            background-image: url('image/bus2.jpg');
            opacity: 1;
            transition: 3s;
          }
          45% {
            opacity: 1;
            transition: 3s;
          }
          50% {
            background-image: url('image/bus3.jpg');
            opacity: 1;
            transition: 3s;
          }
          70% {
            opacity: 1;
            transition: 3s;
          }
          75% {
            background-image: url('image/bus4.jpg');
            opacity: 1;
            transition: 3s;
          }
          95% {
            opacity: 1;
            transition: 3s;
          }
          100% {
            background-image: url('image/bus1.jpg');
            opacity: 1;
            transition: 3s;
          }
        }
      `}</style>
    </Box>
  );
};

export default Layout;