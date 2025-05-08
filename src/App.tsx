import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RoutesPage from './pages/RoutesPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import TicketsPage from './pages/TicketsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { BusProvider } from './context/BusContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BusProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/booking/:routeId?" element={<BookingPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/tickets" element={
                  <ProtectedRoute>
                    <TicketsPage />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </BusProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;