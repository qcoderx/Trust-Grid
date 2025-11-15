import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiClient from '../api';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('policy');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [policy, setPolicy] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [complianceLogs, setComplianceLogs] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (apiKey) => {
    try {
      setLoading(true);
      setError(null);
      
      ApiClient.setApiKey(apiKey);
      const userData = await ApiClient.loginOrganization(apiKey);
      setUser(userData);
      setIsVerified(userData.verification_status === 'verified');
      await loadDashboardData();
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('500')) {
        setError('Server error. Please wait and try again.');
      } else if (error.message.includes('401') || error.message.includes('Invalid')) {
        setError('Invalid API key.');
      } else {
        setError('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (orgName) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ApiClient.registerOrganization(orgName);
      setUser(result.organization);
      setNewApiKey(result.api_key);
      setShowApiKeyModal(true);
      setIsVerified(result.organization.verification_status === 'verified');
      ApiClient.setApiKey(result.api_key);
      await loadDashboardData();
    } catch (error) {
      console.error('Register error:', error);
      if (error.message.includes('500')) {
        setError('Server error. Please wait and try again.');
      } else if (error.message.includes('already exists')) {
        setError('Organization name already exists.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [keysData, logsData, orgData] = await Promise.all([
        ApiClient.getApiKeys().catch(() => []),
        ApiClient.getOrgComplianceLog().catch(() => []),
        ApiClient.getOrganizationDetails().catch(() => null)
      ]);

      setApiKeys(keysData || []);
      setComplianceLogs(logsData || []);
      if (orgData) {
        setPolicy(orgData.policy_text || '');
        setUser(orgData);
        setIsVerified(orgData.verification_status === 'verified');
      }
    } catch (error) {
      console.error('Load dashboard data error:', error);
    }
  };

  const savePolicy = async () => {
    try {
      await ApiClient.updateOrgPolicy(policy);
      alert('Policy saved successfully!');
    } catch (error) {
      console.error('Save policy error:', error);
      alert('Failed to save policy. Please try again.');
    }
  };

  const createApiKey = async (keyName) => {
    try {
      const result = await ApiClient.createApiKey(keyName);
      setApiKeys(prev => [...prev, result.key_details]);
      setNewApiKey(result.api_key);
      setShowApiKeyModal(true);
    } catch (error) {
      console.error('Create API key error:', error);
      alert('Failed to create API key. Please try again.');
    }
  };

  const revokeApiKey = async (keyId) => {
    try {
      await ApiClient.revokeApiKey(keyId);
      setApiKeys(prev => prev.map(key => 
        key._id === keyId ? { ...key, status: 'revoked' } : key
      ));
    } catch (error) {
      console.error('Revoke API key error:', error);
      alert('Failed to revoke API key. Please try again.');
    }
  };

  const submitVerification = async (formData) => {
    try {
      await ApiClient.submitForVerification(formData);
      setShowVerificationModal(false);
      alert('Verification submitted successfully! You will be notified once reviewed.');
      await loadDashboardData();
    } catch (error) {
      console.error('Submit verification error:', error);
      alert('Failed to submit verification. Please try again.');
    }
  };

  const submitDataRequest = async (userId, dataType, purpose) => {
    try {
      await ApiClient.requestDataAccess(userId, dataType, purpose);
      alert('Data request submitted successfully!');
      await loadDashboardData();
    } catch (error) {
      console.error('Submit data request error:', error);
      alert('Failed to submit data request. Please try again.');
    }
  };

  const LoginForm = () => {
    const [mode, setMode] = useState('login');
    const [apiKey, setApiKey] = useState('');
    const [orgName, setOrgName] = useState('');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center gap-3 mb-8">
              <span className="text-primary text-3xl font-bold">&lt;/&gt;</span>
              <div>
                <p className="text-xl font-bold text-black dark:text-white">TrustGrid</p>
                <p className="text-sm text-black/60 dark:text-white/60">Organization Dashboard</p>
              </div>
            </Link>
            <h2 className="text-3xl font-extrabold text-black dark:text-white">
              {mode === 'login' ? 'Sign in to your account' : 'Register your organization'}
            </h2>
          </div>
          <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                    mode === 'login'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent text-black dark:text-white border-black/20 dark:border-white/20'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                    mode === 'register'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent text-black dark:text-white border-black/20 dark:border-white/20'
                  }`}
                >
                  Register
                </button>
              </div>

              {mode === 'login' ? (
                <>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm placeholder-black/50 dark:placeholder-white/50 focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                    placeholder="Enter your API key"
                  />
                  <button
                    onClick={() => handleLogin(apiKey)}
                    disabled={loading || !apiKey}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm placeholder-black/50 dark:placeholder-white/50 focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                    placeholder="Organization Name"
                  />
                  <button
                    onClick={() => handleRegister(orgName)}
                    disabled={loading || !orgName}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="bg-background-light dark:bg-background-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <span className="text-primary text-2xl font-bold">&lt;/&gt;</span>
                <div>
                  <p className="text-lg font-bold text-black dark:text-white">TrustGrid</p>
                  <p className="text-sm text-black/60 dark:text-white/60">Organization Dashboard</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/citizen-app" className="text-black/70 dark:text-white/70 hover:text-primary">
                Citizen App
              </Link>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user?.org_name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-black dark:text-white text-sm font-medium">{user?.org_name}</p>
                  <p className="text-black/60 dark:text-white/60 text-xs">
                    {isVerified ? '✓ Verified' : '⚠ Unverified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'policy', name: 'Privacy Policy' },
                { id: 'verification', name: 'Verification' },
                { id: 'keys', name: 'API Keys' },
                { id: 'logs', name: 'Compliance Logs' },
                { id: 'request', name: 'Data Request' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-6 px-4 sm:px-0">
          {activeTab === 'policy' && (
            <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">Privacy Policy</h3>
              <textarea
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                placeholder="Enter your organization's privacy policy..."
              />
              <button
                onClick={savePolicy}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600"
              >
                Save Policy
              </button>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black dark:text-white">Organization Verification</h3>
                {!isVerified && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600"
                  >
                    Submit for Verification
                  </button>
                )}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isVerified ? '✓' : '⚠'}</span>
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                      {isVerified ? 'Organization Verified' : 'Verification Required'}
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {isVerified 
                        ? 'Your organization has been verified and can access all TrustGrid features.'
                        : 'Submit your CAC certificate and company details for AI-powered verification to unlock full platform access.'}
                    </p>
                  </div>
                </div>
              </div>
              {isVerified && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-black/20 dark:border-white/20 rounded-md">
                    <h4 className="font-medium text-black dark:text-white mb-2">Verification Status</h4>
                    <p className="text-sm text-black/60 dark:text-white/60">Verified Organization</p>
                  </div>
                  <div className="p-4 border border-black/20 dark:border-white/20 rounded-md">
                    <h4 className="font-medium text-black dark:text-white mb-2">Compliance Level</h4>
                    <p className="text-sm text-primary font-medium">Full Access</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black dark:text-white">API Keys</h3>
                <button
                  onClick={() => {
                    const keyName = prompt('Enter API key name:');
                    if (keyName) createApiKey(keyName);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600"
                >
                  Create New Key
                </button>
              </div>
              <div className="space-y-3">
                {apiKeys.map((key, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-black/20 dark:border-white/20 rounded-md">
                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-white">{key.name || `API Key ${index + 1}`}</p>
                      <p className="text-sm text-black/60 dark:text-white/60">sk_***{key.key_hash?.slice(-8) || '****'}</p>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        Created: {new Date(key.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        key.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {key.status}
                      </span>
                      {key.status === 'active' && (
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to revoke this API key?')) {
                              revokeApiKey(key._id);
                            }
                          }}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <p className="text-black/60 dark:text-white/60 text-center py-8">No API keys created yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">Compliance Logs</h3>
              <div className="space-y-3">
                {complianceLogs.map((log, index) => (
                  <div key={index} className="p-4 border border-black/20 dark:border-white/20 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-black dark:text-white">User: {log.user_id}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">Data: {log.data_type}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">Purpose: {log.purpose}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : log.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-black/50 dark:text-white/50 mt-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
                {complianceLogs.length === 0 && (
                  <p className="text-black/60 dark:text-white/60 text-center py-8">No compliance logs yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'request' && (
            <div className="bg-white/5 dark:bg-white/5 shadow rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">Request User Data</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">ℹ️</span>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">AI-Powered Compliance Check</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      All data requests are automatically verified against your privacy policy using our AI compliance engine. 
                      Citizens will receive real-time consent requests on their mobile devices.
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                submitDataRequest(
                  formData.get('userId'),
                  formData.get('dataType'),
                  formData.get('purpose')
                );
                e.target.reset();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">User ID</label>
                  <input
                    name="userId"
                    type="text"
                    placeholder="e.g., ayo"
                    required
                    className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Data Type</label>
                  <select
                    name="dataType"
                    required
                    className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                  >
                    <option value="">Select data type</option>
                    <option value="email">Email Address</option>
                    <option value="phone">Phone Number</option>
                    <option value="bvn">Bank Verification Number</option>
                    <option value="nin">National ID Number</option>
                    <option value="address">Home Address</option>
                    <option value="financial">Financial Information</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1">Purpose</label>
                  <select
                    name="purpose"
                    required
                    className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-transparent text-black dark:text-white"
                  >
                    <option value="">Select purpose</option>
                    <option value="KYC verification">KYC Verification</option>
                    <option value="account setup">Account Setup</option>
                    <option value="transaction processing">Transaction Processing</option>
                    <option value="fraud prevention">Fraud Prevention</option>
                    <option value="marketing">Marketing Communications</option>
                    <option value="customer support">Customer Support</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
                >
                  Submit Data Request
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Submit for Verification</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              submitVerification(formData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Organization Name</label>
                <input name="org_name" type="text" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Company Description</label>
                <textarea name="company_description" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Company Category</label>
                <select name="company_category" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white">
                  <option value="">Select category</option>
                  <option value="Fintech">Fintech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Dating">Dating</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Website URL</label>
                <input name="website_url" type="url" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">Business Registration Number</label>
                <input name="business_registration_number" type="text" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1">CAC Certificate</label>
                <input name="cac_certificate" type="file" accept=".pdf,.jpg,.png" required className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md bg-transparent text-black dark:text-white" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600">Submit</button>
                <button type="button" onClick={() => setShowVerificationModal(false)} className="flex-1 border border-black/20 dark:border-white/20 text-black dark:text-white py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Key Display Modal */}
      {showApiKeyModal && newApiKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">New API Key Created</h3>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                ⚠ This is the only time you'll see this key. Copy it now and store it securely.
              </p>
              <div className="bg-black/10 dark:bg-white/10 p-3 rounded font-mono text-sm break-all">
                {newApiKey}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(newApiKey);
                  alert('API key copied to clipboard!');
                }}
                className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600"
              >
                Copy Key
              </button>
              <button 
                onClick={() => {
                  setShowApiKeyModal(false);
                  setNewApiKey('');
                }}
                className="flex-1 border border-black/20 dark:border-white/20 text-black dark:text-white py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

export default DashboardPage;