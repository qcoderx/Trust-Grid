// pages/DocsPage.jsx
import { useState } from 'react';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsContent from '../components/docs/DocsContent';
import LoginModal from '../components/auth/LoginModal';
import { useAuth } from '../context/AuthContext';

const DocsPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { login, register } = useAuth();

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <DocsSidebar onLoginClick={() => setShowLoginModal(true)} />
      <DocsContent onLoginClick={() => setShowLoginModal(true)} />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  );
};

export default DocsPage;