import ApiKeysTable from './ApiKeysTable';

const ApiKeysSection = ({ onCreateApiKey, loading, error }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Section Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 pt-5">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">API Keys</h2>
        <button
          onClick={() => onCreateApiKey('New API Key')}
          disabled={loading}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-black text-sm font-bold leading-normal tracking-[0.015em] self-start sm:self-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="truncate">{loading ? 'Creating...' : 'Create New API Key'}</span>
        </button>
      </div>

      {error && (
        <div className="px-4">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* API Keys Table */}
      <ApiKeysTable />
    </div>
  );
};

export default ApiKeysSection;
