import { useState, useEffect } from 'react';
import apiClient from '../../api';

const ApiKeysTable = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealedKey, setRevealedKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiClient.getApiKeys();
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = (id, fullKey) => {
    setRevealedKey(revealedKey === id ? null : id);
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    // You could add a toast notification here
  };

  const handleRegenerate = (id) => {
    // Handle regenerate logic
    console.log('Regenerate key:', id);
  };

  const handleRevoke = async (id) => {
    try {
      await apiClient.revokeApiKey(id);
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
                {revealedKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 12)}...`}
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
                  {/* Reveal Button */}
                  <button
                    onClick={() => handleReveal(apiKey.id, apiKey.key)}
                    className={`${apiKey.status === 'revoked' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-primary'}`}
                    disabled={apiKey.status === 'revoked'}
                  >
                    <span className="material-symbols-outlined">
                      {revealedKey === apiKey.id ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(apiKey.key)}
                    className={`${apiKey.status === 'revoked' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-primary'}`}
                    disabled={apiKey.status === 'revoked'}
                  >
                    <span className="material-symbols-outlined">content_copy</span>
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
};

export default ApiKeysTable;
