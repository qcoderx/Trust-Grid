import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CitizenProfileForm from '../components/CitizenProfileForm';
import AuditLogsView from '../components/AuditLogsView';

const CitizenApp = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://127.0.0.1:8000/api/v1/citizen/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({ id: userData._id || username, username: userData.username || username });
        fetchRequests(userData._id || username);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/v1/citizen/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({ id: userData._id || username, username: userData.username || username });
        setNeedsProfile(true);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/citizen/${userId}/log`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    }
  };

  const simulateNewRequest = async () => {
    try {
      const response = await fetch('https://trust-grid.onrender.com/api/v1/request-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'sk_test_demo_key_for_simulation'
        },
        body: JSON.stringify({
          user_id: user?.id || 'ayo',
          data_type: 'bvn',
          purpose: 'KYC verification'
        })
      });
      
      if (response.ok) {
        console.log('Data request submitted successfully');
      } else {
        const newRequest = {
          _id: `req_${Date.now()}`,
          org_id: 'SME-Femi',
          user_id: user?.id || 'ayo',
          data_type: 'bvn',
          purpose: 'KYC verification',
          status: 'pending',
          timestamp: new Date().toISOString(),
        };
        
        setRequests(prev => [...prev, newRequest]);
        setPendingRequest(newRequest);
      }
    } catch (error) {
      console.error('Simulate request error:', error);
      const newRequest = {
        _id: `req_${Date.now()}`,
        org_id: 'SME-Femi',
        user_id: user?.id || 'ayo',
        data_type: 'bvn',
        purpose: 'KYC verification',
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      
      setRequests(prev => [...prev, newRequest]);
      setPendingRequest(newRequest);
    }
  };

  const handleConsentResponse = async (requestId, response) => {
    try {
      const apiResponse = await fetch('http://127.0.0.1:8000/api/v1/citizen/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id: requestId, decision: response })
      });
      
      if (apiResponse.ok) {
        setRequests(prev => prev.map(req => 
          req._id === requestId 
            ? { ...req, status: response, approval_method: 'manual', timestamp_responded: new Date().toISOString() }
            : req
        ));
        setPendingRequest(null);
        fetchRequests(user.username); // Refresh requests
      }
    } catch (error) {
      console.error('Consent response error:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/citizen/${user.username}/requests`);
        if (response.ok) {
          const pendingRequests = await response.json();
          const pending = pendingRequests.find(req => req.status === 'pending');
          if (pending && (!pendingRequest || pendingRequest._id !== pending._id)) {
            setPendingRequest(pending);
          } else if (!pending && pendingRequest) {
            setPendingRequest(null);
          }
          fetchRequests(user.username);
        }
      } catch (error) {
        console.error('Poll requests error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user, pendingRequest]);

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      <div className="relative w-full max-w-sm mx-auto">
        <div className="w-full aspect-[9/19] max-w-[320px] mx-auto bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden relative flex flex-col">
            <div className="flex justify-between items-center px-6 py-3 text-white text-sm flex-shrink-0">
              <span className="font-medium">9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-3 border border-white/60 rounded-sm relative">
                  <div className="w-4 h-1.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 px-6 py-4 flex flex-col justify-center">
              <div className="text-center mb-8">
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl shadow-lg mb-4"
                >
                  <span className="text-white text-2xl">🛡️</span>
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-1">TrustGrid</h1>
                <p className="text-white/70 text-sm">Citizen Portal</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-white mb-1">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {isLogin ? 'Sign in to continue' : 'Join TrustGrid today'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    id="username"
                    type="text"
                    defaultValue={isLogin ? "ayo" : ""}
                    className="w-full px-4 py-3 bg-black/40 border border-white/30 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Username"
                  />

                  <input
                    id="password"
                    type="password"
                    defaultValue={isLogin ? "password" : ""}
                    className="w-full px-4 py-3 bg-black/40 border border-white/30 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Password"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const username = document.getElementById('username').value;
                      const password = document.getElementById('password').value;
                      if (isLogin) {
                        handleLogin(username, password);
                      } else {
                        handleRegister(username, password);
                      }
                    }}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors text-sm disabled:opacity-50"
                  >
                    {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                  </motion.button>

                  <div className="text-center mt-4">
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                      }}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8 pt-20 relative">
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <Link to='/' className="flex items-center gap-3">
          <span className="text-green-500 text-2xl font-bold">&lt;/&gt;</span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-gray-900 hover:text-green-500 transition-colors">TrustGrid</p>
            <p className="text-xs text-gray-600 leading-tight">Citizen Portal</p>
          </div>
        </Link>
        
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-lg">
            <input 
              className="w-full h-10 pl-10 pr-16 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" 
              placeholder="Search TrustGrid documentation..." 
              type="text"
            />
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">🔍</span>
            <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              ⌘K
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/docs" className="text-gray-700 hover:text-green-500 transition-colors font-medium">Docs</Link>
          <Link to="/org-dashboard" className="text-gray-700 hover:text-green-500 transition-colors font-medium">Org Dashboard</Link>
          
          <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.username?.charAt(0)?.toUpperCase() || 'C'}</span>
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">{user?.username}</p>
              <p className="text-gray-600 text-xs">Citizen</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative w-full max-w-sm mx-auto">
        <div className="w-full aspect-[9/19] max-w-[320px] mx-auto bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden relative flex flex-col">
            <div className="flex justify-between items-center px-6 py-3 text-white text-sm flex-shrink-0">
              <span className="font-medium">9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-3 border border-white/60 rounded-sm relative">
                  <div className="w-4 h-1.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-b border-white/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🛡️</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-base">TrustGrid</h1>
                    <p className="text-white/60 text-xs">{user.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfileForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Settings
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={simulateNewRequest}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Demo
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white mb-1">Privacy Dashboard</h2>
                    <p className="text-white/60 text-xs">Your data request overview</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuditLogs(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    View All
                  </motion.button>
                </div>
              </div>

              {/* Pending Requests Section */}
              {requests.filter(req => req.status === 'pending').length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-yellow-400 mb-2">⏳ Pending Approvals</h3>
                  <div className="space-y-2">
                    {requests.filter(req => req.status === 'pending').map((request) => (
                      <div key={request._id} className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-yellow-200 text-sm">{request.org_name || request.org_id}</span>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/40">
                            Pending
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          <p className="text-yellow-100 text-xs"><span className="font-medium">Data:</span> {request.data_type}</p>
                          <p className="text-yellow-100 text-xs"><span className="font-medium">Purpose:</span> {request.purpose}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConsentResponse(request._id, 'approved')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-semibold"
                          >
                            ✓ Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleConsentResponse(request._id, 'denied')}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-semibold"
                          >
                            ✗ Deny
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pb-4">
                {requests.filter(req => req.status !== 'pending').slice(0, 3).map((request) => (
                  <div key={request._id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm truncate">{request.org_name || request.org_id}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                        request.status === 'approved' || request.status === 'auto_approved'
                          ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                          : 'bg-red-500/30 text-red-200 border border-red-500/50'
                      }`}>
                        {request.status === 'auto_approved' ? '⚡ Auto' : request.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-white/80 text-xs"><span className="font-medium">Data:</span> {request.data_type}</p>
                      <p className="text-white/80 text-xs"><span className="font-medium">Purpose:</span> {request.purpose}</p>
                      {request.approval_method && (
                        <p className="text-white/60 text-xs">
                          <span className="font-medium">Method:</span> {request.approval_method === 'auto' ? 'Auto-approved' : 'Manual approval'}
                        </p>
                      )}
                    </div>
                    <p className="text-white/50 text-xs">
                      {new Date(request.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                {requests.filter(req => req.status !== 'pending').length === 0 && (
                  <div className="bg-white/5 rounded-xl p-6 text-center">
                    <div className="text-white/60 text-sm">No data requests yet</div>
                    <div className="text-white/40 text-xs mt-1">Organizations will appear here when they request your data</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {(showProfileForm || needsProfile) && (
        <CitizenProfileForm
          userId={user.username}
          onClose={() => {
            if (needsProfile) return;
            setShowProfileForm(false);
          }}
          onSave={(updatedUser) => {
            setUser(prev => ({ ...prev, ...updatedUser }));
            setShowProfileForm(false);
            setNeedsProfile(false);
            fetchRequests(user.username);
          }}
        />
      )}

      {showAuditLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
              <button 
                onClick={() => setShowAuditLogs(false)} 
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
              <AuditLogsView userId={user.username} />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {pendingRequest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 rounded-[2rem]"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-4"
            >
              <div className="text-center mb-4">
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mb-3"
                >
                  <span className="text-white text-lg">🛡️</span>
                </motion.div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Data Request</h2>
                <p className="text-gray-600 text-xs">Incoming request</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  {pendingRequest.org_name || pendingRequest.org_id} is Requesting:
                </h3>
                
                <div className="space-y-2 text-xs">
                  <p><span className="font-semibold text-gray-700">Data:</span> <span className="font-bold text-gray-900">{pendingRequest.data_type}</span></p>
                  <p><span className="font-semibold text-gray-700">Purpose:</span> <span className="font-bold text-gray-900">{pendingRequest.purpose}</span></p>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConsentResponse(pendingRequest._id, 'approved')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold text-sm"
                >
                  ✓ Approve
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConsentResponse(pendingRequest._id, 'denied')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold text-sm"
                >
                  ✗ Deny
                </motion.button>
              </div>

              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 text-center">
                  🛡️ Protected by TrustGrid
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!user) {
    return <LoginPage />;
  }

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <CitizenProfileForm
          userId={user.username}
          onClose={() => {}} // Prevent closing for new users
          onSave={(updatedUser) => {
            setUser(prev => ({ ...prev, ...updatedUser }));
            setNeedsProfile(false);
            fetchRequests(user.username);
          }}
        />
      </div>
    );
  }

  return <Dashboard />;
};

export default CitizenApp;