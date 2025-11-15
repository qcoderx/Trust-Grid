import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import apiService from '../../services/api';

const ApiKeysTable = forwardRef((props, ref) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedKey, setRevealedKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refreshKeys: fetchApiKeys
  }));

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiService.getApiKeys();
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleRegenerate = (id) => {
    // Handle regenerate logic
    console.log('Regenerate key:', id);
  };

  const handleRevoke = async (id) => {
    try {
      await apiService.revokeApiKey(id);
      // Refresh the keys list
      await fetchApiKeys();
    } catch (err) {
      console.error('Error revoking API key:', err);
      setError('Failed to revoke API key');
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-8 text-center">
        <div className="text-gray-400">Loading API keys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 text-center">
        <div className="text-red-400">{error}</div>
        <button 
          onClick={fetchApiKeys}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="w-full px-4 py-8 text-center">
        <div className="text-gray-400 mb-4">No API keys found</div>
        <p className="text-gray-500 text-sm">Create your first API key to get started with the TrustGrid API.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto px-4">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400" scope="col">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400" scope="col">Key</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400" scope="col">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400" scope="col">Created Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-[#111827]">
          {apiKeys.map((apiKey) => (
            <tr key={apiKey.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                {apiKey.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300 font-mono">
                <span className="text-gray-500">••••••••••••{apiKey.key_hash?.substring(-4) || '••••'}</span>
                <span className="ml-2 text-xs text-gray-600">(Hash stored securely)</span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  apiKey.status === 'active'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {apiKey.status === 'active' ? 'Active' : 'Revoked'}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                {new Date(apiKey.created_date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-3">
                  {/* Info Button */}
                  <button
                    title="API keys are only shown once during creation for security"
                    className="text-gray-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined">info</span>
                  </button>

                  {/* Regenerate Button */}
                  <button
                    onClick={() => handleRegenerate(apiKey.id)}
                    className="text-gray-400 hover:text-primary"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                  </button>

                  {/* Revoke Button */}
                  <button
                    onClick={() => handleRevoke(apiKey.id)}
                    className={`${apiKey.status === 'revoked' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                    disabled={apiKey.status === 'revoked'}
                  >
                    <span className="material-symbols-outlined">block</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ApiKeysTable;
