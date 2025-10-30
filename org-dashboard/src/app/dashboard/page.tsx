"use client";

import { useState, useEffect } from "react";
import { Shield, FileText, Key, List, LogOut } from "lucide-react";

interface ConsentLog {
  _id: string;
  org_id: string;
  user_id: string;
  data_type: string;
  purpose: string;
  status: "pending" | "approved" | "denied";
  timestamp_requested: string;
  timestamp_responded?: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("policy");
  const [policyText, setPolicyText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem("org_logged_in");
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    // Load data based on active tab
    if (activeTab === "policy") loadPolicy();
    else if (activeTab === "credentials") loadCredentials();
    else if (activeTab === "compliance") loadComplianceLogs();
  }, [activeTab]);

  const loadPolicy = async () => {
    // TODO: Fetch policy from API
    setPolicyText("We only collect email for newsletters.");
  };

  const loadCredentials = async () => {
    // TODO: Fetch API key from API
    setApiKey("sk_live_trust_grid_demo_key_123456789");
  };

  const loadComplianceLogs = async () => {
    setIsLoading(true);
    // TODO: Fetch consent logs from API
    setTimeout(() => {
      setConsentLogs([
        {
          _id: "1",
          org_id: "org1",
          user_id: "user1",
          data_type: "email",
          purpose: "newsletter",
          status: "approved",
          timestamp_requested: "2024-01-01T10:00:00Z",
          timestamp_responded: "2024-01-01T10:05:00Z",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const savePolicy = async () => {
    setIsLoading(true);
    // TODO: Save policy via API
    setTimeout(() => {
      alert("Policy saved successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard!");
  };

  const handleLogout = () => {
    localStorage.removeItem("org_logged_in");
    localStorage.removeItem("org_name");
    window.location.href = "/login";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-50";
      case "denied":
        return "text-red-700 bg-red-50";
      case "pending":
        return "text-yellow-700 bg-yellow-50";
      default:
        return "text-neutral-700 bg-neutral-50";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-trust-accent" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Trust-Grid
                </h1>
                <p className="text-sm text-neutral-600">
                  Organization Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("policy")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "policy"
                    ? "bg-trust-accent text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <FileText size={20} />
                <span>Policy Management</span>
              </button>
              <button
                onClick={() => setActiveTab("credentials")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "credentials"
                    ? "bg-trust-accent text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Key size={20} />
                <span>API Credentials</span>
              </button>
              <button
                onClick={() => setActiveTab("compliance")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "compliance"
                    ? "bg-trust-accent text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <List size={20} />
                <span>Compliance Log</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "policy" && (
              <div className="card">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Privacy Policy Management
                </h2>
                <p className="text-neutral-600 mb-6">
                  Define your organization's privacy policy. This will be used
                  by our AI to ensure compliance with data requests.
                </p>
                <textarea
                  value={policyText}
                  onChange={(e) => setPolicyText(e.target.value)}
                  className="input-field h-64 resize-none mb-4"
                  placeholder="Enter your privacy policy..."
                />
                <button
                  onClick={savePolicy}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Policy"}
                </button>
              </div>
            )}

            {activeTab === "credentials" && (
              <div className="card">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  API Credentials
                </h2>
                <p className="text-neutral-600 mb-6">
                  Use this API key to integrate Trust-Grid into your backend
                  systems.
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    Your API Key
                  </p>
                  <div className="flex items-center space-x-3">
                    <code className="flex-1 bg-white px-3 py-2 rounded border font-mono text-sm">
                      {apiKey}
                    </code>
                    <button onClick={copyApiKey} className="btn-secondary">
                      Copy
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Keep this key secure and do not
                    share it publicly. Use it only in your server-side code.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="card">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Compliance Log
                </h2>
                <p className="text-neutral-600 mb-6">
                  View all data requests made through your API key and their
                  current status.
                </p>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-accent mx-auto"></div>
                    <p className="text-neutral-600 mt-2">Loading logs...</p>
                  </div>
                ) : consentLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <List className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No requests yet
                    </h3>
                    <p className="text-neutral-600">
                      Data requests will appear here once your API is in use.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consentLogs.map((log) => (
                      <div
                        key={log._id}
                        className="border border-neutral-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                            <p className="text-sm text-neutral-600">
                              {new Date(
                                log.timestamp_requested
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-neutral-700">
                              Data Type
                            </p>
                            <p className="text-neutral-600 uppercase">
                              {log.data_type}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">
                              Purpose
                            </p>
                            <p className="text-neutral-600">{log.purpose}</p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">
                              User ID
                            </p>
                            <p className="text-neutral-600">{log.user_id}</p>
                          </div>
                          {log.timestamp_responded && (
                            <div>
                              <p className="font-medium text-neutral-700">
                                Responded
                              </p>
                              <p className="text-neutral-600">
                                {new Date(
                                  log.timestamp_responded
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
