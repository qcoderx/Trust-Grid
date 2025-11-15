import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedApiKey = localStorage.getItem('trustgrid_api_key');
    console.log('AuthContext: Checking stored API key:', !!storedApiKey);
    
    if (storedApiKey) {
      apiService.setApiKey(storedApiKey);
      // Verify the API key by fetching org details
      apiService.getOrganizationDetails()
        .then(org => {
          console.log('AuthContext: Successfully verified stored API key');
          setUser(org);
        })
        .catch((error) => {
          console.error('AuthContext: Failed to verify stored API key:', error);
          // Invalid API key, remove it
          localStorage.removeItem('trustgrid_api_key');
          apiService.setApiKey(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('AuthContext: No stored API key found');
      setLoading(false);
    }
  }, []);

  const login = async (loginData) => {
    try {
      console.log('AuthContext: Attempting login');
      const org = await apiService.loginOrganization(loginData);
      console.log('AuthContext: Login successful');

      // Store the API key from the response
      if (org.api_key) {
        localStorage.setItem('trustgrid_api_key', org.api_key);
      }

      setUser(org);
      return org;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const register = async (registrationData) => {
    try {
      console.log('AuthContext: Attempting registration for:', registrationData.org_name);
      const response = await apiService.registerOrganization(registrationData);
      const { organization, api_key } = response;
      console.log('AuthContext: Registration successful');
      apiService.setApiKey(api_key);
      localStorage.setItem('trustgrid_api_key', api_key);
      setUser(organization);
      return { organization, api_key };
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('trustgrid_api_key');
    apiService.setApiKey(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};