// components/MainContent.jsx
import { Link } from "react-router-dom";
import { useState } from 'react';

const MainContent = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    javascript: {
      code: `import TrustGrid from '@trustgrid/sdk';

const trustgrid = new TrustGrid({
  apiKey: 'your-api-key',
  tenantId: 'your-tenant-id'
});

// Record user consent
await trustgrid.consent.record({
  userId: 'user_123',
  purpose: 'transaction_processing', 
  action: 'granted'
});

// Revoke consent when needed
await trustgrid.consent.revoke({
  userId: 'user_123',
  purpose: 'marketing'
});`,
      language: 'javascript'
    },
    python: {
      code: `from trustgrid import TrustGrid

client = TrustGrid(
  api_key='your-api-key',
  tenant_id='your-tenant-id'
)

# Record user consent
await client.consent.record(
  user_id='user_123',
  purpose='transaction_processing',
  action='granted'
)

# Revoke consent when needed
await client.consent.revoke(
  user_id='user_123',
  purpose='marketing'
)`,
      language: 'python'
    },
    curl: {
      code: `# Record consent
curl -X POST \\
  'https://api.trustgrid.ng/v1/events' \\
  -H 'Authorization: Bearer your-api-key' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event_type": "consent_given",
    "user_id": "user_123",
    "purpose": "transaction_processing",
    "tenant_id": "your-tenant-id",
    "timestamp": "2023-10-25T10:30:00Z"
  }'

# Revoke consent
curl -X POST \\
  'https://api.trustgrid.ng/v1/events' \\
  -H 'Authorization: Bearer your-api-key' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event_type": "consent_revoked", 
    "user_id": "user_123",
    "purpose": "marketing",
    "tenant_id": "your-tenant-id",
    "timestamp": "2023-10-26T15:45:00Z"
  }'`,
      language: 'bash'
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[selectedLanguage].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = codeExamples[selectedLanguage].code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const highlightCode = (code, language) => {
    return code.split('\n').map((line, index) => {
      const highlightedLine = line.split(' ').map((word, wordIndex) => {
        if (language === 'javascript' || language === 'python') {
          // Keywords
          if (['import', 'from', 'async', 'await', 'const', 'new', 'def', 'class'].includes(word)) {
            return <span key={wordIndex} className="text-purple-400">{word} </span>;
          }
          // Functions and classes
          if (['TrustGrid', 'trustgrid', 'client', 'consent', 'record', 'revoke'].includes(word.replace(/[(),]/g, ''))) {
            return <span key={wordIndex} className="text-yellow-300">{word} </span>;
          }
          // Strings and values
          if (word.includes("'") || word.includes('"') || word.includes('your-')) {
            return <span key={wordIndex} className="text-green-400">{word} </span>;
          }
          // Numbers
          if (/\d/.test(word)) {
            return <span key={wordIndex} className="text-orange-400">{word} </span>;
          }
        }
        
        if (language === 'bash') {
          // curl commands
          if (word === 'curl' || word === '-X' || word === '-H' || word === '-d') {
            return <span key={wordIndex} className="text-purple-400">{word} </span>;
          }
          // URLs and endpoints
          if (word.includes('https://') || word.includes('/v1/')) {
            return <span key={wordIndex} className="text-green-400">{word} </span>;
          }
          // JSON data
          if (word.includes('{') || word.includes('}') || word.includes('"')) {
            return <span key={wordIndex} className="text-yellow-300">{word} </span>;
          }
        }
        
        return <span key={wordIndex}>{word} </span>;
      });

      return (
        <div key={index} className="flex">
          <span className="text-gray-500 select-none mr-4 w-8 text-right">{index + 1}</span>
          <span className="flex-1">{highlightedLine}</span>
        </div>
      );
    });
  };

  return (
    <main className="pt-24 px-6 text-black dark:text-white flex-1">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent">
            TrustGrid Developer Platform
          </h1>
          <p className="text-xl text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
            Build compliant applications with programmable data trust. Capture consent, generate audit logs, and ensure transparency.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to='/docs'>
              <button className="bg-primary hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </Link>
            <Link to='docs#quickstart'>
              <button className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-semibold transition-colors">
                API Reference
              </button>
            </Link>
          </div>
          
          {/* Demo Section */}
          <div className="mt-12 flex gap-4 justify-center">
            <Link to='/org-dashboard'>
              <button className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Organization Dashboard
              </button>
            </Link>
            <Link to='/citizen-app'>
              <button className="border border-primary text-primary hover:bg-primary/10 px-6 py-2 rounded-lg font-medium transition-colors">
                Citizen App
              </button>
            </Link>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="mb-16">
          <div className="relative h-full min-h-[400px] rounded-xl border border-primary/20 bg-background-dark/50 p-6 shadow-2xl shadow-primary/10">
            {/* Window Controls */}
            <div className="absolute inset-x-6 top-6 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
            </div>
            
            {/* Language Selector */}
            <div className="absolute top-16 right-6 flex gap-2">
              {Object.keys(codeExamples).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedLanguage === lang 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
                </button>
              ))}
            </div>
            
            {/* Code Display */}
            <div className="mt-20 h-full w-full overflow-auto rounded-lg bg-black/30 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Quick Start Example</h3>
                <button 
                  onClick={handleCopy}
                  className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm font-mono whitespace-pre-wrap">
                <code className="text-gray-300">
                  {highlightCode(codeExamples[selectedLanguage].code, selectedLanguage)}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Platform Components */}
        <div className="bg-white/5 dark:bg-white/5 p-8 rounded-xl border border-white/10 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Compliance Platform</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 dark:bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-primary">Organization Dashboard</h3>
              <p className="text-black/70 dark:text-white/70 mb-4 text-sm">
                Complete management interface for developers and compliance teams. Handle privacy policies, API credentials, and compliance monitoring.
              </p>
              <Link to='/org-dashboard'>
                <button className="w-full bg-primary hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Access Dashboard
                </button>
              </Link>
            </div>
            <div className="bg-white/5 dark:bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-primary">Citizen Portal</h3>
              <p className="text-black/70 dark:text-white/70 mb-4 text-sm">
                Mobile-first interface for citizens to manage consent, view transparency logs, and control their data usage permissions.
              </p>
              <Link to='/citizen-app'>
                <button className="w-full border border-primary text-primary hover:bg-primary/10 py-2 rounded-lg font-medium transition-colors">
                  View Portal
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 dark:bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-primary">AI-Powered Compliance</h3>
            <p className="text-black/70 dark:text-white/70">
              Automatically verify data requests against privacy policies using advanced AI analysis and real-time compliance checking.
            </p>
          </div>
          
          <div className="bg-white/5 dark:bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-primary">Citizen Control</h3>
            <p className="text-black/70 dark:text-white/70">
              Empower users with transparent consent management and real-time data request notifications through our mobile-first interface.
            </p>
          </div>
          
          <div className="bg-white/5 dark:bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-primary">Compliance Dashboard</h3>
            <p className="text-black/70 dark:text-white/70">
              Monitor all data requests, policy updates, and compliance metrics in one comprehensive dashboard with real-time insights.
            </p>
          </div>
          
          <div className="bg-white/5 dark:bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-primary">NDPR Compliance</h3>
            <p className="text-black/70 dark:text-white/70">
              Built specifically for Nigerian Data Protection Regulation (NDPR) compliance with automated verification and audit trails.
            </p>
          </div>
        </div>

        {/* Why TrustGrid Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose TrustGrid?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white">security</span>
              </div>
              <h3 className="font-bold mb-2">Regulatory Compliance</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                Built-in compliance with major privacy regulations including GDPR, CCPA, and PIPEDA.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white">code</span>
              </div>
              <h3 className="font-bold mb-2">Developer Experience</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                Clean APIs, comprehensive documentation, and easy integration with your existing stack.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white">scale</span>
              </div>
              <h3 className="font-bold mb-2">Enterprise Ready</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                Scalable architecture with multi-tenant support, designed for organizations of all sizes.
              </p>
            </div>
          </div>
        </div>

        {/* SDKs Section */}
        <div className="bg-white/5 dark:bg-white/5 p-8 rounded-xl border border-white/10 mb-16">
          <h2 className="text-2xl font-bold mb-6">SDKs & Libraries</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">JS</span>
              </div>
              <h3 className="font-bold mb-2">JavaScript/TypeScript</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                For web applications, React, Vue, Angular, and Node.js backends
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">Py</span>
              </div>
              <h3 className="font-bold mb-2">Python</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                For Django, Flask, FastAPI, and data science applications
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">MD</span>
              </div>
              <h3 className="font-bold mb-2">Mobile</h3>
              <p className="text-black/70 dark:text-white/70 text-sm">
                For React Native, Flutter, iOS, and Android applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;