import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Parts from './pages/Parts';
import Layout from './components/shared/Layout';
import Unauthorized from './pages/Unauthorized';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Slideshow background */}
      <div className="slideshow"></div>
      
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner', 'accountant', 'workshop', 'conductor', 'inspector','hr']} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner','hr']} />}>
                  <Route path="/fleet" element={<Fleet />} />
                </Route>
                
                <Route path="/trips" element={<Trips />} />
                
                <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner', 'workshop','hr']} />}>
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/parts" element={<Parts />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;