import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import QuickEntry from './pages/QuickEntry.jsx';
import Ranges from './pages/Ranges.jsx';
import Placeholder from './pages/Placeholder.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quick" element={<QuickEntry />} />
        <Route path="/ranges" element={<Ranges />} />
        <Route path="/diary" element={<Placeholder />} />
        <Route path="/analytics" element={<Placeholder />} />
        <Route path="/reminders" element={<Placeholder />} />
        <Route path="/profile" element={<Placeholder />} />
        <Route path="/settings" element={<Placeholder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
