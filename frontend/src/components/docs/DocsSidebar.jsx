import { useState } from 'react';
import { Link } from 'react-router-dom';

const DocsSidebar = ({ onLoginClick }) => {
  const [openSections, setOpenSections] = useState({
    gettingStarted: true,
    features: true,
    apiReference: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="sticky top-0 h-screen w-80 flex-shrink-0 flex-col bg-background-dark p-4 overflow-y-auto">
      {/* Logo Header */}
      <Link to='/'>
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-black text-lg font-bold">&lt;/&gt;</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-base font-medium leading-normal">TrustGrid</h1>
          <p className="text-gray-400 text-sm font-normal leading-normal">for Developers</p>
        </div>
      </div>
      </Link>

      {/* Search Bar with Theme Toggle */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="flex flex-col h-11 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-gray-700 focus-within:border-primary transition-colors">
                <div className="text-gray-400 flex items-center justify-center pl-3">
                  <span className="material-symbols-outlined !text-2xl">search</span>
                </div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-200 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-2 text-sm font-normal leading-normal" 
                  placeholder="Search documentation..." 
                />
              </div>
            </label>
          </div>
          
          {/* Theme Toggle */}
          <button 
            className="relative flex h-7 w-[3.25rem] items-center rounded-full border border-gray-700 hover:border-gray-600 p-1 transition-colors flex-shrink-0"
            aria-label="Toggle dark mode"
          >
            <div className="z-10 flex w-full items-center justify-between px-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-600 dark:text-gray-600 fill-current">
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
              
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-300 dark:text-gray-300 fill-current">
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
            
            <div className="absolute left-1 h-5 w-5 rounded-full bg-gray-100 dark:bg-white/[0.07] transition-transform duration-200 dark:translate-x-[1.40rem]"></div>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {/* WELCOME Section */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">WELCOME</p>
          <div className="space-y-1">
            <a href="#overview" className="block text-primary font-medium py-2 px-3 text-sm rounded-md bg-primary/20 hover:bg-primary/30 transition-colors">
              Overview
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* GETTING STARTED Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md hover:bg-gray-900/50 transition-colors"
            onClick={() => toggleSection('gettingStarted')}
          >
            <p className="text-gray-200 text-sm font-medium">GETTING STARTED</p>
            <span className={`material-symbols-outlined text-gray-400 transition-transform ${openSections.gettingStarted ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
          
          {openSections.gettingStarted && (
            <div className="ml-4 mt-2 space-y-1">
              <a href="#overview" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                Overview
              </a>
              <a href="#api-setup" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                API Setup
              </a>
              <a href="#quickstart" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
               Quick Start
              </a>
              <a href="#libraries" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                Libraries
              </a>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* FEATURES Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md hover:bg-gray-900/50 transition-colors"
            onClick={() => toggleSection('features')}
          >
            <p className="text-gray-200 text-sm font-medium">FEATURES</p>
            <span className={`material-symbols-outlined text-gray-400 transition-transform ${openSections.features ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
          
          {openSections.features && (
            <div className="ml-4 mt-2 space-y-1">
              <a href="#consent-management" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
               Consent Management
              </a>
              <a href="#audit-logging" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
               Audit Logging
              </a>
              <a href="#data-transparency" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
               Data Transparency
              </a>
              <a href="#compliance-reporting" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
               Compliance Reporting
              </a>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* API REFERENCE Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md hover:bg-gray-900/50 transition-colors"
            onClick={() => toggleSection('apiReference')}
          >
            <p className="text-gray-200 text-sm font-medium">API REFERENCE</p>
            <span className={`material-symbols-outlined text-gray-400 transition-transform ${openSections.apiReference ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
          
          {openSections.apiReference && (
            <div className="ml-4 mt-2 space-y-3">
              <a href="#authentication" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                Authentication
              </a>
              <a href="#endpoints" className="block text-gray-400 hover:text-white py-2 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                Endpoints
              </a>
              
              {/* Nested Endpoints */}
              <div className="ml-4 space-y-1">
                <a href="#health-check" className="block text-gray-400 hover:text-white py-1 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                  Health Check
                </a>
                <a href="#citizen-endpoints" className="block text-gray-400 hover:text-white py-1 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                  Citizen Endpoints
                </a>
                <a href="#organization-endpoints" className="block text-gray-400 hover:text-white py-1 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors">
                  Organization Endpoints
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* API Keys at the bottom */}
        <div className="mt-auto">
          <button 
            onClick={onLoginClick}
            className="w-full text-left text-gray-400 hover:text-white py-3 px-3 text-sm rounded-md hover:bg-gray-900/50 transition-colors border border-gray-800 hover:border-gray-700"
          >
            Get API Keys
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default DocsSidebar;