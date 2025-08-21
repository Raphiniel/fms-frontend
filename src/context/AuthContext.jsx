import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

// Mock user data for development
const MOCK_USERS = [
  {
    email: 'admin@fms.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Admin'
  },
  {
    email: 'hr@fms.com',
    password: 'hr123',
    role: 'hr',
    name: 'HR'
  },
  {
    email: 'manager@fms.com',
    password: 'manager123',
    role: 'fleet_manager',
    name: 'Fleet Manager'
  },
    {
    email: 'inspector@fms.com',
    password: 'inspector123',
    role: 'inspector',
    name: 'Bus Inspector'
  },
  {
    email: 'conductor@fms.com',
    password: 'conductor123',
    role: 'conductor',
    name: 'Bus Conductor'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        // In a real app, this would verify a JWT token
        // For now, we'll just use the mock user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Create a simple "token" (not a real JWT)
        const mockToken = btoa(JSON.stringify({ email: user.email }));
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(mockToken);
        setUser(user);
        navigate('/dashboard');
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);