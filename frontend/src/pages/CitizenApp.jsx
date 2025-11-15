import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApiClient from '../api';

const CitizenApp = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await ApiClient.loginCitizen(username, password);
      setUser(userData);
      await fetchRequests(userData.username);
    } catch (error) {
      console.error('Login error:', error);
      try {
        await handleRegister(username, password);
      } catch (regError) {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const userData = await ApiClient.registerCitizen(username, password);
      setUser(userData);
      await fetchRequests(userData.username);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const fetchRequests = async (userId) => {
    try {
      const [transparencyLog, pendingRequests] = await Promise.all([
        ApiClient.getCitizenTransparencyLog(userId).catch(() => []),
        ApiClient.getPendingRequests(userId).catch(() => [])
      ]);
      
      setRequests(transparencyLog || []);
      
      // Check for pending requests
      const pending = pendingRequests?.find(req => req.status === 'pending');
      if (pending && !pendingRequest) {
        setPendingRequest(pending);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
      // Fallback to demo data
      setRequests([
        {
          _id: '1',
          org_id: 'SME-Femi',
          user_id: userId,
          data_type: 'email',
          purpose: 'newsletter',
          status: 'approved',
          timestamp: '2024-01-15T10:30:00Z'
        }
      ]);
    }
  };

  const simulateNewRequest = async () => {
    const newRequest = {
      _id: `req_${Date.now()}`,
      org_id: 'SME-Femi',
      user_id: user?.username || 'ayo',
      data_type: 'bvn',
      purpose: 'KYC verification',
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    
    setRequests(prev => [...prev, newRequest]);
    setPendingRequest(newRequest);
  };

  const handleConsentResponse = async (requestId, response) => {
    try {
      await ApiClient.respondToRequest(requestId, response);
      
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: response, timestamp_responded: new Date().toISOString() }
          : req
      ));
      setPendingRequest(null);
      
      // Refresh data
      if (user) {
        await fetchRequests(user.username);
      }
    } catch (error) {
      console.error('Consent response error:', error);
      // Update locally even if API fails
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: response, timestamp_responded: new Date().toISOString() }
          : req
      ));
      setPendingRequest(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const pendingRequests = await ApiClient.getPendingRequests(user.username);
        const pending = pendingRequests?.find(req => req.status === 'pending');
        if (pending && !pendingRequest) {
          setPendingRequest(pending);
          await fetchRequests(user.username);
        }
      } catch (error) {
        console.error('Poll requests error:', error);
      }
    }, 5000);

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
                  <h2 className="text-lg font-bold text-white mb-1">Welcome Back</h2>
                  <p className="text-white/70 text-sm">Sign in to continue</p>
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
                    defaultValue="ayo"
                    className="w-full px-4 py-3 bg-black/40 border border-white/30 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Username"
                  />

                  <input
                    id="password"
                    type="password"
                    defaultValue="password"
                    className="w-full px-4 py-3 bg-black/40 border border-white/30 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Password"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const username = document.getElementById('username').value;
                      const password = document.getElementById('password').value;
                      handleLogin(username, password);
                    }}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors text-sm disabled:opacity-50"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </motion.button>
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

            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-base font-bold text-white mb-1">Privacy Log</h2>
                <p className="text-white/60 text-xs">Your data request history</p>
              </div>

              <div className="space-y-3 pb-4">
                {requests.filter(req => req.status !== 'pending').map((request) => (
                  <div key={request._id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm truncate">{request.org_id}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2 ${
                        request.status === 'approved' 
                          ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                          : 'bg-red-500/30 text-red-200 border border-red-500/50'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-white/80 text-xs"><span className="font-medium">Data:</span> {request.data_type}</p>
                      <p className="text-white/80 text-xs"><span className="font-medium">Purpose:</span> {request.purpose}</p>
                    </div>
                    <p className="text-white/50 text-xs">
                      {new Date(request.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <div className="w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

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
                  {pendingRequest.org_id} is Requesting:
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

  return <Dashboard />;
};

export default CitizenApp;