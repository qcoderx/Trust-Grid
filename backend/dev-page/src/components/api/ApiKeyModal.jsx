// components/ApiKeyModal.jsx
import { useState } from 'react';

const ApiKeyModal = ({ apiKey, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      {/* Modal Dialog */}
      <div className="bg-[#111827] rounded-xl shadow-2xl w-full max-w-md border border-[#1f2937]">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">API Key Generated</h3>
          </div>
          
          <div className="mt-4 bg-[#1f2937] p-4 rounded-lg border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-400 mt-1">warning</span>
              <div>
                <p className="text-sm font-medium text-yellow-400">Important: Copy your API Key</p>
                <p className="text-xs text-[#9ca3af] mt-1">
                  This is your only chance to copy the API key. For security reasons, it will not be shown again.
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 bg-black/50 p-3 rounded-md">
              <span className="font-mono text-sm text-[#E5E7EB] truncate flex-1">
                {apiKey}
              </span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white transition-colors p-1.5 rounded-md"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-green-600 transition-colors"
            >
              <span className="truncate">Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;