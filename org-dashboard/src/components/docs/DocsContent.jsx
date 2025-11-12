// components/DocsContent.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DocsContent = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
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
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Overview Section */}
      <section id="overview" className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">TrustGrid Developer Documentation</h1>
        <p className="text-gray-300 text-lg mb-6">
          Build compliant applications with programmable data trust. Capture consent, generate audit logs, 
          and ensure transparency with TrustGrid's powerful API.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white">shield</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Consent Management</h3>
            <p className="text-gray-400">
              Capture and manage user consent with immutable audit trails and granular purpose-based controls.
            </p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white">fact_check</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Audit Logging</h3>
            <p className="text-gray-400">
              Track every data access and consent change with complete transparency logs and real-time monitoring.
            </p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white">gpp_good</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Compliance Ready</h3>
            <p className="text-gray-400">
              Built-in compliance with GDPR, CCPA, and other privacy regulations out of the box.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="getting-started" className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
        
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Integration</h3>
          <p className="text-gray-300 mb-4">
            TrustGrid follows a client-server architecture with easy-to-integrate components:
          </p>
          <ul className="text-gray-300 list-disc list-inside space-y-2 mb-4">
            <li><strong>TrustGrid-Lib (SDK):</strong> Lightweight JavaScript library for client-side consent capture</li>
            <li><strong>Backend API:</strong> RESTful API for processing and storing audit events</li>
            <li><strong>Admin Console:</strong> Web-based dashboard for compliance monitoring</li>
          </ul>
        </div>

        {/* API Setup */}
        <div id="api-setup" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">API Setup</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              To get started with TrustGrid API, you'll need to:
            </p>
            <ol className="text-gray-300 list-decimal list-inside space-y-2 mb-4">
              <li>Create an account on TrustGrid Developer Portal</li>
              <li>Generate your API keys from the dashboard</li>
              <li>Configure your tenant settings</li>
              <li>Integrate the SDK into your application</li>
            </ol>
          </div>
        </div>

        {/* Quick Start */}
        <div id="quickstart" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Start</h3>
          
          <div className="bg-black rounded-xl p-6 mb-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-semibold">SDK Initialization</h4>
              <button className="text-white/60 hover:text-white text-sm">Copy</button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Initialize TrustGrid SDK
TrustGrid.init({
  apiBaseUrl: 'https://api.trustgrid.ng/v1',
  tenantId: 'your-tenant-id',
  defaultPurposes: ['transaction_processing', 'marketing']
});

// Record user consent
TrustGrid.recordConsent('user_123', 'transaction_processing', 'granted');`}
            </pre>
          </div>
        </div>

        {/* Libraries */}
        <div id="libraries" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Libraries</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              TrustGrid provides SDKs for popular programming languages:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">JavaScript/TypeScript</h4>
                <code className="text-green-400 text-sm">npm install @trustgrid/sdk</code>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Python</h4>
                <code className="text-green-400 text-sm">pip install trustgrid-sdk</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Features</h2>
        
        {/* Consent Management */}
        <div id="consent-management" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Consent Management</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              Capture and manage user consent with purpose-based granular controls. Each consent event is 
              immutably logged for complete audit trails.
            </p>
            <div className="bg-black rounded-xl p-4 mb-4">
              <pre className="text-green-400 text-sm overflow-x-auto">
{`// Record consent
TrustGrid.recordConsent('user_123', 'marketing', 'granted');

// Revoke consent  
TrustGrid.revokeConsent('user_123', 'marketing');`}
              </pre>
            </div>
          </div>
        </div>

        {/* Audit Logging */}
        <div id="audit-logging" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Audit Logging</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              Every data access and consent change is automatically logged with complete context, 
              including timestamps, purposes, and metadata.
            </p>
          </div>
        </div>

        {/* Data Transparency */}
        <div id="data-transparency" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Data Transparency</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              Provide users with complete visibility into how their data is being used through 
              transparency logs and access history.
            </p>
          </div>
        </div>

        {/* Compliance Reporting */}
        <div id="compliance-reporting" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Compliance Reporting</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              Generate compliance reports for GDPR, CCPA, and other regulations automatically 
              from your audit data.
            </p>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section id="api-reference" className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
        
        {/* Authentication */}
        <div id="authentication" className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Authentication</h3>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
              TrustGrid uses API keys for authentication. Include your API key in the request header:
            </p>
            <div className="bg-black p-4 rounded-lg mb-4">
              <code className="text-green-400 text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <p className="text-gray-300">
              You can generate and manage your API keys from the developer dashboard.
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div id="endpoints" className="space-y-8">
          
          {/* Health Check */}
          <div id="health-check" className="bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
              <code className="text-white font-mono">/health</code>
              <span className="text-gray-400 text-sm">Health Check</span>
            </div>
            <p className="text-gray-300 mb-4">Check API service status and connectivity.</p>
          </div>

          {/* Citizen Endpoints */}
          <div id="citizen-endpoints">
            <h3 className="text-2xl font-bold text-white mb-4">Citizen Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-white font-mono">/api/v1/citizen/register</code>
                  <span className="text-gray-400 text-sm">Create User</span>
                </div>
                <p className="text-gray-300 mb-4">Register a new citizen/user in the system.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-white font-mono">/api/v1/citizen/&#123;user_id&#125;/requests</code>
                  <span className="text-gray-400 text-sm">Get Pending Requests</span>
                </div>
                <p className="text-gray-300 mb-4">Retrieve pending data access requests for a user.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-white font-mono">/api/v1/citizen/respond</code>
                  <span className="text-gray-400 text-sm">Respond To Request</span>
                </div>
                <p className="text-gray-300 mb-4">Allow users to respond to data access requests.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-white font-mono">/api/v1/citizen/&#123;user_id&#125;/log</code>
                  <span className="text-gray-400 text-sm">Get Citizen Transparency Log</span>
                </div>
                <p className="text-gray-300 mb-4">Retrieve complete audit trail for a citizen.</p>
              </div>
            </div>
          </div>

          {/* Organization Endpoints */}
          <div id="organization-endpoints">
            <h3 className="text-2xl font-bold text-white mb-4">Organization Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-white font-mono">/api/v1/request-data</code>
                  <span className="text-gray-400 text-sm">Request Data Access</span>
                </div>
                <p className="text-gray-300 mb-4">Request access to citizen data for specific purposes.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono">POST</span>
                  <code className="text-white font-mono">/api/v1/org/policy</code>
                  <span className="text-gray-400 text-sm">Update Org Policy</span>
                </div>
                <p className="text-gray-300 mb-4">Update organization data handling policies.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-white font-mono">/api/v1/org/log</code>
                  <span className="text-gray-400 text-sm">Get Org Compliance Log</span>
                </div>
                <p className="text-gray-300 mb-4">Retrieve organization-wide compliance audit trail.</p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono">GET</span>
                  <code className="text-white font-mono">/api/v1/org/me</code>
                  <span className="text-gray-400 text-sm">Get Org Details</span>
                </div>
                <p className="text-gray-300 mb-4">Retrieve current organization details and settings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Keys Section */}
    <section id="api-keys" className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Keys</h2>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-300 mb-4">
            Manage your API keys from the developer dashboard. Each key is associated with your 
            organization and has specific permissions.
            </p>
            
            <div className="bg-black p-4 rounded-lg mb-6">
            <code className="text-green-400 text-sm">
                // Generate new API key from dashboard<br/>
                // Keep your keys secure and never commit them to version control
            </code>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg mb-4">
            <div>
                <h3 className="text-white font-semibold mb-1">Manage Your API Keys</h3>
                <p className="text-gray-300 text-sm">
                Create, view, and manage your API keys in the secure profile section
                </p>
            </div>
            <Link 
                to="/profile"
                className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-lg">key</span>
                API Keys
            </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">security</span>
                Security Best Practices
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                <li>• Never expose API keys in client-side code</li>
                <li>• Use environment variables</li>
                <li>• Rotate keys regularly</li>
                <li>• Set appropriate permissions</li>
                </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                Key Management
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                <li>• Create multiple keys for different environments</li>
                <li>• Set expiration dates for temporary keys</li>
                <li>• Monitor key usage and revoke unused keys</li>
                <li>• Regenerate compromised keys immediately</li>
                </ul>
            </div>
            </div>
        </div>
        </section>
    </main>
  );
};

export default DocsContent;