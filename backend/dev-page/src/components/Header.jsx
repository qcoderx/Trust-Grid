// components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';

const Header = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (apiKey) => {
    await login(apiKey);
    navigate('/profile');
  };

  const handleRegister = async (orgName) => {
    const result = await register(orgName);
    // Don't navigate immediately - let modal show API key first
    return result;
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && true); // default to dark if not set
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 dark:border-white/10 bg-background-light dark:bg-background-dark px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link to='/'>
        <div className="flex items-center gap-4">
          <a className="flex items-center gap-3 group" href="#">
            <span className="text-primary text-2xl font-bold">&lt;/&gt;</span>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-black dark:text-white group-hover:text-primary transition-colors">TrustGrid</p>
              <p className="text-xs text-black/60 dark:text-white/60 leading-tight">for Developers</p>
            </div>
          </a>
        </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-lg">
            <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/50 dark:text-white/50">search</span>
            <input 
              className="w-full h-10 pl-10 pr-16 rounded-lg border border-black/20 dark:border-white/20 bg-transparent text-sm text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
              placeholder="Search TrustGrid documentation..." 
              type="text"
            />
            <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-medium text-black/60 dark:text-white/60">
              ⌘K
            </div>
          </div>
        </div>

        {/* Theme Toggle and Profile */}
        <div className="flex items-center gap-3">
          {/* New Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="relative flex h-7 w-[3.25rem] items-center rounded-full border border-gray-200/70 dark:border-white/[0.07] hover:border-gray-200 dark:hover:border-white/10 p-1 transition-colors"
            aria-label="Toggle dark mode"
          >
            <div className="z-10 flex w-full items-center justify-between px-1">
              {/* Sun Icon (Light Mode) */}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                xmlns="http://www.w3.org/2000/svg" 
                className="size-3 text-gray-600 dark:text-gray-600 fill-current"
              >
                <g clipPath="url(#clip0_2880_7340)">
                  <path d="M8 1.11133V2.00022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M12.8711 3.12891L12.2427 3.75735" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M14.8889 8H14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M12.8711 12.8711L12.2427 12.2427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M8 14.8889V14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3.12891 12.8711L3.75735 12.2427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M1.11133 8H2.00022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3.12891 3.12891L3.75735 3.75735" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M8.00043 11.7782C10.0868 11.7782 11.7782 10.0868 11.7782 8.00043C11.7782 5.91402 10.0868 4.22266 8.00043 4.22266C5.91402 4.22266 4.22266 5.91402 4.22266 8.00043C4.22266 10.0868 5.91402 11.7782 8.00043 11.7782Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
                <defs>
                  <clipPath id="clip0_2880_7340">
                    <rect width="16" height="16" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
              
              {/* Moon Icon (Dark Mode) */}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                xmlns="http://www.w3.org/2000/svg" 
                className="size-3 text-gray-300 dark:text-gray-300 fill-current"
              >
                <g clipPath="url(#clip0_2880_7355)">
                  <path d="M11.5556 10.4445C8.48717 10.4445 6.00005 7.95743 6.00005 4.88899C6.00005 3.68721 6.38494 2.57877 7.03294 1.66943C4.04272 2.22766 1.77783 4.84721 1.77783 8.0001C1.77783 11.5592 4.66317 14.4445 8.22228 14.4445C11.2196 14.4445 13.7316 12.3948 14.4525 9.62321C13.6081 10.1414 12.6187 10.4445 11.5556 10.4445Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </g>
                <defs>
                  <clipPath id="clip0_2880_7355">
                    <rect width="16" height="16" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            
            {/* Toggle Circle */}
            <div className={`absolute left-1 h-5 w-5 rounded-full bg-gray-100 dark:bg-white/[0.07] transition-transform duration-200 ${
              darkMode ? 'translate-x-[1.40rem]' : 'translate-x-0'
            }`}></div>
          </button>
          
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-black/60 dark:text-white/60 hidden sm:block">
                {user?.org_name}
              </span>
              <Link
                className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black/20 dark:border-white/20 text-black dark:text-white hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark transition-colors" 
                to="/profile"
              >
                <span className="material-symbols-outlined text-2xl">person</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-primary hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
};

export default Header;