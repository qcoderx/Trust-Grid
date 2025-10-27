import { useState } from 'react';
import ProfileHeader from '../components/api/ProfileHeader';
import ApiKeysSection from '../components/api/ApiKeysSection';
import ApiKeyModal from '../components/api/ApiKeyModal';
import Header from '../components/Header';
import apiClient from '../api';

const ProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateApiKey = async (name = 'New API Key') => {
    try {
      setLoading(true);
      setError(null);
      const createdKey = await apiClient.createApiKey(name);
      setNewApiKey(createdKey.key);
      setShowModal(true);
    } catch (err) {
      setError('Failed to create API key');
      console.error('Error creating API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewApiKey('');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 sm:px-10 md:px-20 lg:px-40">
          <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">

            {/* Header */}
            <div className="mb-8">
              <Header />
            </div>

            {/* Main Content */}
            <main className="flex-1 px-4 py-8">
              <ProfileHeader />
              <ApiKeysSection onCreateApiKey={handleCreateApiKey} loading={loading} error={error} />
            </main>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showModal && (
        <ApiKeyModal apiKey={newApiKey} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfilePage;
