import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import AdminDashboard from './pages/admin/Dashboard';
import { Button } from './components/ui/button';
import { Calendar, ListChecks, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <MainLayout>
        <nav className="mb-8">
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="ghost" className="flex gap-2">
                <Calendar size={20} />
                Book Appointment
              </Button>
            </Link>
            <Link to="/appointments">
              <Button variant="ghost" className="flex gap-2">
                <ListChecks size={20} />
                My Appointments
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" className="flex gap-2">
                <Settings size={20} />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;