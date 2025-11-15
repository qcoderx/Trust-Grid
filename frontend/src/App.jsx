import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DocsPage from './pages/DocsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import CitizenApp from './pages/CitizenApp';
import Favicon from './components/Favicon';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <>
      <Favicon />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/org-dashboard" element={<DashboardPage />} />
            <Route path="/citizen-app" element={<CitizenApp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}