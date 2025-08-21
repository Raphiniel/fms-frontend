<<<<<<< HEAD
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   TextField, 
//   Button, 
//   Typography, 
//   Container, 
//   Paper,
//   CssBaseline,
//   Grid,
//   Link,
//   Avatar,
//   InputAdornment,
//   IconButton,
//   CircularProgress // Added for loading indicator
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // Added for loading state
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       // Step 1: Await the login from your AuthContext.
//       // We assume `login` returns user data (including a token) upon success.
//       const userData = await login(email, password);

//       // Step 2: If login is successful, get the device location.
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;

//             // Step 3: Send coordinates to your backend.
//             // This is a "fire-and-forget" request. We don't wait for it to complete
//             // to ensure the user gets redirected quickly.
//             fetch('/api/user/update-location', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 // This assumes your userData object contains the auth token.
//                 'Authorization': `Bearer ${userData.token}` 
//               },
//               body: JSON.stringify({ latitude, longitude }),
//             }).catch(err => {
//               // Log any errors, but don't block the user.
//               console.error("Failed to send location data to backend:", err);
//             });
            
//             // Step 4: Navigate to the dashboard immediately after getting coordinates.
//             navigate('/dashboard');
//           },
//           (error) => {
//             console.error("Error getting location: ", error.message);
//             // IMPORTANT: Still navigate the user even if they deny location access.
//             navigate('/dashboard');
//           }
//         );
//       } else {
//         console.log("Geolocation is not available in this browser.");
//         // Navigate even if geolocation isn't supported.
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       setError('Invalid credentials. Please try again.');
//       setIsLoading(false); // Stop loading only on login failure.
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <CssBaseline />
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Avatar sx={{ m: 1, bgcolor: 'black' }}>
//           <LockOutlinedIcon sx={{ color: '#ffeb3b' }} />
//         </Avatar>
//         <Typography component="h1" variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
//           FMS Login
//         </Typography>
//         <Paper 
//           elevation={6} 
//           sx={{ 
//             mt: 3, 
//             p: 4, 
//             width: '100%',
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             border: '2px solid black'
//           }}
//         >
//           {error && (
//             <Typography 
//               color="error" 
//               align="center" 
//               sx={{ 
//                 mb: 2,
//                 backgroundColor: '#ffeb3b',
//                 color: 'black',
//                 p: 1,
//                 borderRadius: 1
//               }}
//             >
//               {error}
//             </Typography>
//           )}
//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isLoading} // Disable form while loading
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': { borderColor: 'black' },
//                   '&:hover fieldset': { borderColor: 'black' },
//                   '&.Mui-focused fieldset': { borderColor: 'black' },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'black',
//                   '&.Mui-focused': { color: 'black' },
//                 },
//               }}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isLoading} // Disable form while loading
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       edge="end"
//                       sx={{ color: 'black' }}
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': { borderColor: 'black' },
//                   '&:hover fieldset': { borderColor: 'black' },
//                   '&.Mui-focused fieldset': { borderColor: 'black' },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'black',
//                   '&.Mui-focused': { color: 'black' },
//                 },
//               }}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isLoading} // Disable button while loading
//               sx={{
//                 mt: 3,
//                 mb: 2,
//                 py: 1.5,
//                 backgroundColor: 'black',
//                 color: '#ffeb3b',
//                 fontWeight: 'bold',
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//                 '&.Mui-disabled': { // Style for disabled state
//                   backgroundColor: 'grey',
//                 }
//               }}
//             >
//               {isLoading ? <CircularProgress size={24} sx={{ color: '#ffeb3b' }} /> : 'Sign In'}
//             </Button>
//             <Grid container>
//               <Grid item xs>
//                 <Link href="#" variant="body2" sx={{ color: 'black' }}>
//                   Forgot password?
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
=======
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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
<<<<<<< HEAD
  CircularProgress
=======
  CircularProgress // Added for loading indicator
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
<<<<<<< HEAD
// Import the new service
import { updateUserLocation } from '../services/locationService';
=======
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
=======
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
<<<<<<< HEAD
      // We assume `login` returns some user data on success, though we don't use it here
      await login(email, password);

=======
      // Step 1: Await the login from your AuthContext.
      // We assume `login` returns user data (including a token) upon success.
      const userData = await login(email, password);

      // Step 2: If login is successful, get the device location.
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

<<<<<<< HEAD
            // Use our local storage service to save the location
            updateUserLocation({ email: email }, { latitude, longitude });

            // Navigate to the dashboard
=======
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
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
            navigate('/dashboard');
          },
          (error) => {
            console.error("Error getting location: ", error.message);
<<<<<<< HEAD
            // Still navigate even if location is denied.
=======
            // IMPORTANT: Still navigate the user even if they deny location access.
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
            navigate('/dashboard');
          }
        );
      } else {
        console.log("Geolocation is not available in this browser.");
<<<<<<< HEAD
=======
        // Navigate even if geolocation isn't supported.
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
<<<<<<< HEAD
      setIsLoading(false);
=======
      setIsLoading(false); // Stop loading only on login failure.
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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
<<<<<<< HEAD
              disabled={isLoading}
=======
              disabled={isLoading} // Disable form while loading
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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
<<<<<<< HEAD
              disabled={isLoading}
=======
              disabled={isLoading} // Disable form while loading
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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
<<<<<<< HEAD
              disabled={isLoading}
=======
              disabled={isLoading} // Disable button while loading
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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
<<<<<<< HEAD
                '&.Mui-disabled': {
=======
                '&.Mui-disabled': { // Style for disabled state
>>>>>>> ac2cca77905088bccfc73a995ba4e02bf20df319
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