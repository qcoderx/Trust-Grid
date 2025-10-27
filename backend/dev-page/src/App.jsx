import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DocsPage from './pages/DocsPage';
import ProfilePage from './pages/ProfilePage';
import Favicon from './components/Favicon';

export default function App() {
  return (
    <>
      <Favicon />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}