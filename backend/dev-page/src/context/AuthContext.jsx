import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api';

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
    if (storedApiKey) {
      apiClient.setApiKey(storedApiKey);
      // Verify the API key by fetching org details
      apiClient.getOrganizationDetails()
        .then(org => {
          setUser(org);
        })
        .catch(() => {
          // Invalid API key, remove it
          localStorage.removeItem('trustgrid_api_key');
          apiClient.setApiKey(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (apiKey) => {
    try {
      const org = await apiClient.loginOrganization(apiKey);
      apiClient.setApiKey(apiKey);
      localStorage.setItem('trustgrid_api_key', apiKey);
      setUser(org);
      return org;
    } catch (error) {
      throw new Error('Invalid API key');
    }
  };

  const register = async (orgName) => {
    try {
      const response = await apiClient.registerOrganization(orgName);
      const { organization, api_key } = response;
      apiClient.setApiKey(api_key);
      localStorage.setItem('trustgrid_api_key', api_key);
      setUser(organization);
      return { organization, api_key };
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('trustgrid_api_key');
    apiClient.setApiKey(null);
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