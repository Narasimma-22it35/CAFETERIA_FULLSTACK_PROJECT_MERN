import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import RestaurantDetails from './pages/RestaurantDetails';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import Invoice from './pages/Invoice';

// Helper to handle root redirection
const RootRedirect = () => {
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    console.error("Root redirect check failed");
  }

  if (!user) return <Navigate to="/auth" />;
  return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/invoice/:orderId" element={<Invoice />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/analytics" element={<AdminDashboard />} />
      {/* Fallback for existing links */}
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
