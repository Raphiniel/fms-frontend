import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Parts from './pages/Parts';
import HrManagement from './pages/HrManagement';
import AccountingManagement from './pages/AccountingManagement';
import DriversManagement from './pages/DriversManagement';
import InspectorsManagement from './pages/InspectorsManagement';
import ConductorsManagement from './pages/ConductorsManagement';
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
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner', 'accountant', 'workshop', 'conductor', 'inspector', 'hr']} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Fleet Management */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner', 'hr']} />}>
                  <Route path="/fleet" element={<Fleet />} />
                </Route>
                
                {/* Trips */}
                <Route path="/trips" element={<Trips />} />
                
                {/* Maintenance */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'owner', 'workshop', 'hr']} />}>
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/parts" element={<Parts />} />
                </Route>
                
                {/* HR Management */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
                  <Route path="/hr-management" element={<HrManagement />} />
                </Route>
                
                {/* Accounting */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'accountant']} />}>
                  <Route path="/accounting" element={<AccountingManagement />} />
                </Route>
                
                {/* Drivers Management */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'fleet_manager', 'hr']} />}>
                  <Route path="/drivers" element={<DriversManagement />} />
                </Route>
                
                {/* Inspectors Management */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
                  <Route path="/inspectors" element={<InspectorsManagement />} />
                </Route>
                
                {/* Conductors Management */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
                  <Route path="/conductors" element={<ConductorsManagement />} />
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