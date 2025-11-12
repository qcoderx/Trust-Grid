import { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('policy');
  const [policy, setPolicy] = useState('We only collect email for newsletters.');
  const [apiKey] = useState('sk_live_1234567890abcdef');
  const [copied, setCopied] = useState(false);

  const consentLogs = [
    {
      _id: '1',
      org_id: 'SME-Femi',
      user_id: 'ayo',
      data_type: 'email',
      purpose: 'newsletter',
      status: 'approved',
      timestamp_requested: '2024-01-15T10:30:00Z',
      timestamp_responded: '2024-01-15T10:32:00Z'
    },
    {
      _id: '2', 
      org_id: 'SME-Femi',
      user_id: 'ayo',
      data_type: 'bvn',
      purpose: 'KYC verification',
      status: 'pending',
      timestamp_requested: '2024-01-15T11:45:00Z'
    }
  ];

  const handleSavePolicy = async () => {
    // POST /api/v1/org/policy
    console.log('Saving policy:', policy);
    alert('Policy saved successfully!');
  };

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <span className="text-primary text-2xl font-bold">&lt;/&gt;</span>
              <div>
                <h1 className="text-xl font-bold text-white">TrustGrid</h1>
                <p className="text-sm text-white/60">SME-Femi's Organization</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="text-white/60 hover:text-white transition-colors font-medium"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent">
            Organization Dashboard
          </h2>
          <p className="text-white/70">
            Manage your privacy policy, API credentials, and compliance logs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-xl p-1 mb-8">
          {[
            { id: 'policy', label: 'Policy Management' },
            { id: 'credentials', label: 'API Credentials' },
            { id: 'logs', label: 'Compliance Log' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Policy Management */}
        {activeTab === 'policy' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8">
            <h3 className="text-xl font-bold text-white mb-4">Privacy Policy</h3>
            <p className="text-white/70 mb-6">
              Define what data your organization collects and for what purposes. This will be used by AI to validate data requests.
            </p>
            <textarea
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="w-full h-48 p-4 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="Enter your organization's privacy policy..."
            />
            <button
              onClick={handleSavePolicy}
              className="mt-6 bg-primary hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Save Policy
            </button>
          </div>
        )}

        {/* API Credentials */}
        {activeTab === 'credentials' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8">
            <h3 className="text-xl font-bold text-white mb-4">API Credentials</h3>
            <p className="text-white/70 mb-6">
              Use this API key in your backend to integrate with TrustGrid. Keep it secure and never expose it in client-side code.
            </p>
            
            <div className="bg-black/30 border border-white/20 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">TRUST_GRID_API_KEY</h4>
                <button
                  onClick={handleCopyApiKey}
                  className="text-primary hover:text-green-300 text-sm font-medium transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="text-sm font-mono text-green-400 break-all">{apiKey}</code>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-blue-300 mb-3">Integration Example:</h4>
              <pre className="text-sm text-blue-200 overflow-x-auto">
{`from trustgrid import TrustGrid

client = TrustGrid(api_key="${apiKey}")

# Request user data
response = client.request_data(
    user_id="ayo",
    data_type="bvn", 
    purpose="KYC verification"
)`}
              </pre>
            </div>
          </div>
        )}

        {/* Compliance Log */}
        {activeTab === 'logs' && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8">
            <h3 className="text-xl font-bold text-white mb-4">Compliance Log</h3>
            <p className="text-white/70 mb-6">
              All consent requests for your organization. This immutable log ensures full transparency and compliance.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Data Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Requested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {consentLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-white">{log._id}</td>
                      <td className="px-6 py-4 text-sm text-white">{log.user_id}</td>
                      <td className="px-6 py-4 text-sm text-white uppercase">{log.data_type}</td>
                      <td className="px-6 py-4 text-sm text-white">{log.purpose}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'approved' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : log.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {new Date(log.timestamp_requested).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;