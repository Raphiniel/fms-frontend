import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  CssBaseline,
  Grid,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress // Added for loading indicator
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Await the login from your AuthContext.
      // We assume `login` returns user data (including a token) upon success.
      const userData = await login(email, password);

      // Step 2: If login is successful, get the device location.
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Step 3: Send coordinates to your backend.
            // This is a "fire-and-forget" request. We don't wait for it to complete
            // to ensure the user gets redirected quickly.
            fetch('/api/user/update-location', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // This assumes your userData object contains the auth token.
                'Authorization': `Bearer ${userData.token}` 
              },
              body: JSON.stringify({ latitude, longitude }),
            }).catch(err => {
              // Log any errors, but don't block the user.
              console.error("Failed to send location data to backend:", err);
            });
            
            // Step 4: Navigate to the dashboard immediately after getting coordinates.
            navigate('/dashboard');
          },
          (error) => {
            console.error("Error getting location: ", error.message);
            // IMPORTANT: Still navigate the user even if they deny location access.
            navigate('/dashboard');
          }
        );
      } else {
        console.log("Geolocation is not available in this browser.");
        // Navigate even if geolocation isn't supported.
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false); // Stop loading only on login failure.
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
          <LockOutlinedIcon sx={{ color: '#ffeb3b' }} />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          FMS Login
        </Typography>
        <Paper 
          elevation={6} 
          sx={{ 
            mt: 3, 
            p: 4, 
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid black'
          }}
        >
          {error && (
            <Typography 
              color="error" 
              align="center" 
              sx={{ 
                mb: 2,
                backgroundColor: '#ffeb3b',
                color: 'black',
                p: 1,
                borderRadius: 1
              }}
            >
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // Disable form while loading
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: 'black' },
                  '&.Mui-focused fieldset': { borderColor: 'black' },
                },
                '& .MuiInputLabel-root': {
                  color: 'black',
                  '&.Mui-focused': { color: 'black' },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Disable form while loading
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: 'black' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'black' },
                  '&:hover fieldset': { borderColor: 'black' },
                  '&.Mui-focused fieldset': { borderColor: 'black' },
                },
                '& .MuiInputLabel-root': {
                  color: 'black',
                  '&.Mui-focused': { color: 'black' },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading} // Disable button while loading
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: 'black',
                color: '#ffeb3b',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#333',
                },
                '&.Mui-disabled': { // Style for disabled state
                  backgroundColor: 'grey',
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#ffeb3b' }} /> : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: 'black' }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;