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
  Money, People, Sell, Person2, Person2Outlined, Menu 
} from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a0ca3 0%, #7209b7 100%)',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: theme.palette.background.default,
    borderRight: 'none',
    boxShadow: theme.shadows[3],
    width: 240,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
}));

const StyledNavItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 2),
  width: 'auto',
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      background: theme.palette.primary.main,
    },
  },
  '&.active': {
    backgroundColor: `${theme.palette.primary.main}15`,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 2,
      background: theme.palette.primary.main,
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
    { text: 'HR', icon: <People/>, path: '/hr', roles: ['admin', 'owner'] },
    { text: 'Drivers', icon: <Person2 />, path: '/drivers', roles: ['admin', 'fleet_manager', 'owner'] },
    { text: 'Inspectors', icon: <Person2Outlined />, path: '/inspectors', roles: ['admin', 'fleet_manager', 'owner'] },
    { text: 'Conductors', icon: <Sell />, path: '/conductors', roles: ['admin', 'fleet_manager', 'owner'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => user?.role === role)
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <Button 
              color="inherit" 
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Menu />
            </Button>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            <Box component="span" sx={{ 
              background: 'linear-gradient(45deg, #f72585 0%, #4cc9f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}>
              Bus365
            </Box>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: deepPurple[500], 
              width: 36, 
              height: 36,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: theme.shadows[4],
              }
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user?.role}
              </Typography>
            </Box>
            <Button 
              color="inherit" 
              onClick={logout} 
              startIcon={<Logout />}
              sx={{ 
                ml: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
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
                color: theme.palette.text.secondary,
                letterSpacing: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                }
              }}>
                Navigation
              </Typography>
            </Box>
            <Divider sx={{ 
              my: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
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
                color: theme.palette.text.disabled,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                }
              }}>
                Bus365 v1.0.0
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
          background: theme.palette.mode === 'light' 
            ? '#f5f7fa' 
            : theme.palette.background.default,
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar />
        <Box sx={{ 
          borderRadius: 2,
          p: 3,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
          }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;