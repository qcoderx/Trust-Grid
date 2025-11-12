'use client'

import { Shield, User, Bell, Lock, HelpCircle, LogOut, ChevronRight, Eye } from 'lucide-react'

interface SettingsPageProps {
  onNavigate: (page: string) => void
  onLogout: () => void
  hasNotification?: boolean
}

export default function SettingsPage({ onNavigate, onLogout, hasNotification }: SettingsPageProps) {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { id: 'profile', icon: User, label: 'Edit Profile', description: 'Update your personal information' },
        { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { 
          id: 'privacy', 
          icon: Shield, 
          label: 'Privacy & Data Control', 
          description: 'Manage data permissions and view transparency logs',
          hasNotification,
          highlight: true
        },
        { id: 'security', icon: Lock, label: 'Security', description: 'Password and security settings' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support' },
      ]
    }
  ]

  const handleItemClick = (itemId: string) => {
    if (itemId === 'privacy') {
      onNavigate('privacy')
    }
    // Handle other settings navigation here
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">Manage your account and privacy preferences</p>
      </div>

      {/* User Profile Card */}
      <div className="card-elevated mb-8">
        <div className="flex items-center space-x-4">
          <div className="avatar w-16 h-16">
            <span className="text-xl">A</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-neutral-900">Ayo Adebayo</h2>
            <p className="text-neutral-600">@ayo_adebayo</p>
            <p className="text-sm text-neutral-500 mt-1">Member since January 2024</p>
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="btn-vibe-outline"
          >
            <Eye size={16} className="mr-2" />
            View Profile
          </button>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full card hover:shadow-md transition-all duration-200 ${
                      item.highlight ? 'ring-2 ring-trust-200 bg-trust-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.highlight ? 'bg-trust-100' : 'bg-neutral-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          item.highlight ? 'text-trust-600' : 'text-neutral-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-neutral-900">{item.label}</h4>
                          {item.hasNotification && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">{item.description}</p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Trust-Grid Info */}
      <div className="card bg-trust-50 border-trust-200 mt-8">
        <div className="flex items-start space-x-4">
          <Shield className="w-8 h-8 text-trust-600 mt-1" />
          <div>
            <h3 className="font-semibold text-trust-700 mb-2">Protected by Trust-Grid</h3>
            <p className="text-sm text-trust-600 mb-4">
              SocialVibe uses Trust-Grid's AI-powered privacy protection to ensure your data is only 
              accessed with your explicit consent and in compliance with stated privacy policies.
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-trust-600">Real-time consent management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-trust-600">AI compliance verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-trust-600">Immutable audit logs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-trust-600">Granular data control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}