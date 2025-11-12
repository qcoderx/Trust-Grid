'use client'

import { useState, useEffect } from 'react'
import { Shield, Clock, CheckCircle, XCircle, Eye, AlertTriangle, Settings, Lock } from 'lucide-react'

interface Request {
  _id: string
  org_id: string
  user_id: string
  data_type: string
  purpose: string
  status: 'pending' | 'approved' | 'denied'
  timestamp_requested: string
  timestamp_responded?: string
}

interface PrivacySettingsProps {
  user: { id: string; username: string }
  requests: Request[]
  onBack: () => void
}

export default function PrivacySettings({ user, requests, onBack }: PrivacySettingsProps) {
  const [activeTab, setActiveTab] = useState<'transparency' | 'permissions' | 'settings'>('transparency')
  
  const completedRequests = requests.filter(req => req.status !== 'pending')
  const approvedRequests = requests.filter(req => req.status === 'approved')
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getOrgName = (orgId: string) => {
    const orgNames: { [key: string]: string } = {
      'org1': 'SME-Femi\'s Site',
      'org2': 'TechCorp Nigeria',
      'org3': 'FinanceApp Ltd',
      'socialvibe': 'SocialVibe'
    }
    return orgNames[orgId] || orgId
  }

  const dataPermissions = [
    { type: 'phone_number', label: 'Phone Number', description: 'Used for account verification', enabled: approvedRequests.some(r => r.data_type === 'phone_number') },
    { type: 'location_data', label: 'Location Data', description: 'For location-based features', enabled: approvedRequests.some(r => r.data_type === 'location_data') },
    { type: 'bvn', label: 'BVN', description: 'Identity verification', enabled: approvedRequests.some(r => r.data_type === 'bvn') },
    { type: 'social_accounts', label: 'Social Accounts', description: 'Cross-platform integration', enabled: approvedRequests.some(r => r.data_type === 'social_accounts') },
    { type: 'usage_analytics', label: 'Usage Analytics', description: 'Personalized recommendations', enabled: approvedRequests.some(r => r.data_type === 'usage_analytics') },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={onBack}
            className="text-vibe-600 hover:text-vibe-700 mb-2 text-sm"
          >
            ← Back to Settings
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">Privacy & Data Control</h1>
          <p className="text-neutral-600">Manage your data permissions and view transparency logs</p>
        </div>
        <div className="flex items-center space-x-2 bg-trust-50 border border-trust-200 rounded-xl px-4 py-2">
          <Shield className="w-5 h-5 text-trust-600" />
          <span className="text-sm font-medium text-trust-700">Trust-Grid Protected</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 mb-8">
        {[
          { id: 'transparency', label: 'Transparency Log', icon: Eye },
          { id: 'permissions', label: 'Data Permissions', icon: Lock },
          { id: 'settings', label: 'Privacy Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-vibe-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Transparency Log Tab */}
      {activeTab === 'transparency' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Your Data Transparency Log</h2>
              <p className="text-neutral-600">Complete history of all data access requests</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900">{completedRequests.length}</div>
              <div className="text-sm text-neutral-600">Total Requests</div>
            </div>
          </div>

          {completedRequests.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No requests yet</h3>
              <p className="text-neutral-600">Organizations will appear here when they request access to your data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedRequests.map((request) => (
                <div key={request._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getStatusIcon(request.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-neutral-900">{getOrgName(request.org_id)}</h3>
                          <span className={`status-badge ${
                            request.status === 'approved' ? 'status-approved' :
                            request.status === 'denied' ? 'status-denied' : 'status-pending'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-neutral-700">Data Requested</p>
                            <p className="text-neutral-600 uppercase">{request.data_type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">Purpose</p>
                            <p className="text-neutral-600">{request.purpose}</p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">Requested</p>
                            <p className="text-neutral-600">{new Date(request.timestamp_requested).toLocaleString()}</p>
                          </div>
                          {request.timestamp_responded && (
                            <div>
                              <p className="font-medium text-neutral-700">Responded</p>
                              <p className="text-neutral-600">{new Date(request.timestamp_responded).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Permissions Tab */}
      {activeTab === 'permissions' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Data Permissions</h2>
            <p className="text-neutral-600">Control what data organizations can access</p>
          </div>

          <div className="space-y-4">
            {dataPermissions.map((permission) => (
              <div key={permission.type} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      permission.enabled ? 'bg-green-100' : 'bg-neutral-100'
                    }`}>
                      {permission.enabled ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{permission.label}</h3>
                      <p className="text-sm text-neutral-600">{permission.description}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {permission.enabled ? 'Currently enabled' : 'Not granted'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      permission.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {permission.enabled ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">How Data Permissions Work</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Organizations must request permission before accessing your data</li>
                  <li>• You receive real-time notifications for all data requests</li>
                  <li>• You can approve or deny each request individually</li>
                  <li>• All decisions are logged in your transparency history</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Privacy Settings</h2>
            <p className="text-neutral-600">Configure your privacy preferences</p>
          </div>

          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Real-time Consent Requests</p>
                    <p className="text-sm text-neutral-600">Get notified immediately when organizations request data</p>
                  </div>
                  <div className="w-12 h-6 bg-vibe-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Weekly Privacy Summary</p>
                    <p className="text-sm text-neutral-600">Receive weekly reports of data access activity</p>
                  </div>
                  <div className="w-12 h-6 bg-vibe-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="card">
              <h3 className="font-semibold text-neutral-900 mb-4">Data Retention</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-neutral-900 mb-2">Transparency Log Retention</p>
                  <select className="input-field">
                    <option>Keep forever (recommended)</option>
                    <option>5 years</option>
                    <option>2 years</option>
                    <option>1 year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trust-Grid Info */}
            <div className="card bg-trust-50 border-trust-200">
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-trust-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-trust-700 mb-2">About Trust-Grid Protection</h3>
                  <p className="text-sm text-trust-600 mb-4">
                    Trust-Grid uses AI-powered compliance checking to ensure organizations only access data 
                    that aligns with their stated privacy policies. Every request is analyzed in real-time 
                    before reaching you.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-trust-700">✓ AI Policy Verification</p>
                      <p className="text-trust-600">Automatic compliance checking</p>
                    </div>
                    <div>
                      <p className="font-medium text-trust-700">✓ Real-time Notifications</p>
                      <p className="text-trust-600">Instant consent requests</p>
                    </div>
                    <div>
                      <p className="font-medium text-trust-700">✓ Immutable Logging</p>
                      <p className="text-trust-600">Permanent audit trail</p>
                    </div>
                    <div>
                      <p className="font-medium text-trust-700">✓ Granular Control</p>
                      <p className="text-trust-600">Individual request approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}