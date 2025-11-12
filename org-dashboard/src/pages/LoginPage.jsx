import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: 'femi@sme.com', password: 'password' });
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing */}
        <div className="text-center mb-8">
          <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">
            ← Back to TrustGrid
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-primary text-3xl font-bold">&lt;/&gt;</span>
              <div>
                <h1 className="text-2xl font-bold text-white">TrustGrid</h1>
                <p className="text-sm text-white/60">Organization Portal</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-white/70">
              {isSignUp ? 'Set up your organization' : 'Sign in to your organization dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="SME-Femi's Business"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-lg"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/5 text-white/50">Demo Access</span>
              </div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              className="w-full mt-4 border border-primary text-primary hover:bg-primary/10 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Continue as SME-Femi (Demo)
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-green-300 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;