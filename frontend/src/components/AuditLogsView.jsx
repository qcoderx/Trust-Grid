import { useState, useEffect } from 'react';

const AuditLogsView = ({ userId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/citizen/${userId}/log`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          setError('Failed to fetch audit logs');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchLogs();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'auto_approved': return 'text-blue-400 bg-blue-400/10';
      case 'denied': return 'text-red-400 bg-red-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✓';
      case 'auto_approved': return '⚡';
      case 'denied': return '✗';
      case 'pending': return '⏳';
      default: return '?';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading audit logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Data Access Audit Log</h2>
        <div className="text-sm text-white/60">
          {logs.length} total requests
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white/5 rounded-lg p-8 text-center">
          <div className="text-white/60 text-lg">No data requests yet</div>
          <div className="text-white/40 text-sm mt-2">
            Organizations that request your data will appear here
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)} {log.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {log.approval_method && (
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {log.approval_method === 'auto' ? 'Auto-approved' : 'Manual approval'}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-white font-medium">
                      {log.org_name || 'Unknown Organization'} requested your <span className="text-blue-400">{log.data_type}</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      <strong>Purpose:</strong> {log.purpose}
                    </div>
                    {log.ai_reason && (
                      <div className="text-white/60 text-sm">
                        <strong>AI Analysis:</strong> {log.ai_reason}
                      </div>
                    )}
                    <div className="text-white/50 text-xs">
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-lg">ℹ️</div>
          <div className="text-blue-400 text-sm">
            <div className="font-medium mb-1">About Your Data Requests</div>
            <ul className="space-y-1 text-blue-400/80">
              <li>• <strong>Auto-approved:</strong> Requests that passed AI compliance checks and your privacy settings allow automatic approval</li>
              <li>• <strong>Manual approval:</strong> Requests you personally approved or denied</li>
              <li>• <strong>Pending:</strong> Requests waiting for your approval (check your notifications)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;