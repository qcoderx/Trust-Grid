import { useState } from 'react';

const ApiKeyDisplayModal = ({ isOpen, onClose, apiKey, orgName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = apiKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-lg w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-2xl">check</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-white/70">
            Welcome to TrustGrid, <strong>{orgName}</strong>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            Your API Key
          </label>
          <div className="relative">
            <input
              type="text"
              value={apiKey}
              readOnly
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm pr-12 focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
              title="Copy API key"
            >
              <span className="material-symbols-outlined text-lg">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-sm mt-2">API key copied to clipboard!</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400 text-xl mt-0.5">warning</span>
            <div>
              <p className="text-red-400 font-medium text-sm mb-1">Important Security Notice</p>
              <p className="text-red-400/80 text-sm">
                This API key will only be shown once. Make sure to copy and store it securely. 
                You won't be able to see it again after closing this modal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">content_copy</span>
            {copied ? 'Copied!' : 'Copy API Key'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-colors border border-white/20"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDisplayModal;