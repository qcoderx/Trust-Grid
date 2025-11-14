import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiKeyDisplayModal from './ApiKeyDisplayModal';

const LoginModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [apiKey, setApiKey] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await onLogin(apiKey);
      } else {
        const result = await onRegister(orgName);
        // Show the API key modal after registration
        if (result.api_key) {
          setRegistrationResult(result);
          setShowApiKeyModal(true);
        }
      }
      if (mode === 'login') {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setApiKey('');
    setOrgName('');
    setError('');
  };

  const handleApiKeyModalClose = () => {
    setShowApiKeyModal(false);
    setRegistrationResult(null);
    onClose();
    // Redirect to profile page after registration modal is closed
    navigate('/profile');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Login to TrustGrid' : 'Register Organization'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-primary text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-primary text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'login' ? (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
                required
              />
              <p className="text-white/60 text-xs mt-1">
                Enter the API key you received during registration
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter your organization name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
                required
              />
              <p className="text-white/60 text-xs mt-1">
                This will create a new organization and generate your first API key
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register Organization'}
          </button>
        </form>

        {mode === 'register' && (
          <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>Important:</strong> Your API key will be shown only once after registration. 
              Make sure to copy and store it securely.
            </p>
          </div>
        )}
      </div>
      
      <ApiKeyDisplayModal
        isOpen={showApiKeyModal}
        onClose={handleApiKeyModalClose}
        apiKey={registrationResult?.api_key}
        orgName={registrationResult?.organization?.org_name}
      />
    </div>
  );
};

export default LoginModal;