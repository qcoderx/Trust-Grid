import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DocsPage from './pages/DocsPage';
import ProfilePage from './pages/ProfilePage';
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}