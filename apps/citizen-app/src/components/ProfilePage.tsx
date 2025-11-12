'use client'

import { useState } from 'react'
import { Camera, MapPin, Phone, CreditCard, Instagram, Twitter, Shield, Edit3, Settings } from 'lucide-react'

interface ProfilePageProps {
  onDataRequest: (dataType: string, purpose: string) => void
}

export default function ProfilePage({ onDataRequest }: ProfilePageProps) {
  const [profile, setProfile] = useState({
    name: 'Ayo Adebayo',
    username: '@ayo_adebayo',
    bio: 'Digital creator | Tech enthusiast | Coffee lover ☕️',
    location: '',
    phone: '',
    bvn: '',
    website: 'ayoadebayo.dev',
    followers: 1247,
    following: 892,
    posts: 156
  })

  const [isEditing, setIsEditing] = useState(false)

  const handlePhoneRequest = () => {
    onDataRequest('phone_number', 'account verification and security')
  }

  const handleBVNRequest = () => {
    onDataRequest('bvn', 'identity verification for premium features')
  }

  const handleLocationRequest = () => {
    onDataRequest('location_data', 'location-based content and networking')
  }

  const handleSocialConnect = (platform: string) => {
    onDataRequest('social_accounts', `connect ${platform} account for cross-posting`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card-elevated mb-6">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 md:h-48 gradient-vibe rounded-xl mb-6"></div>
          
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="avatar w-24 h-24 border-4 border-white shadow-lg">
                <span className="text-2xl">A</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-vibe-600 rounded-full flex items-center justify-center text-white hover:bg-vibe-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-neutral-900">{profile.name}</h1>
              <p className="text-neutral-600">{profile.username}</p>
              <p className="text-neutral-700 mt-2">{profile.bio}</p>
              {profile.website && (
                <a href={`https://${profile.website}`} className="text-vibe-600 hover:text-vibe-700 text-sm">
                  {profile.website}
                </a>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn-vibe-outline"
              >
                <Edit3 size={16} className="mr-2" />
                Edit Profile
              </button>
              <button className="btn-ghost">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-8 mt-6 pt-6 border-t border-neutral-200">
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profile.posts}</div>
              <div className="text-sm text-neutral-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profile.followers.toLocaleString()}</div>
              <div className="text-sm text-neutral-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-neutral-900">{profile.following}</div>
              <div className="text-sm text-neutral-600">Following</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">Personal Information</h2>
            <Shield className="w-5 h-5 text-trust-600" />
          </div>

          <div className="space-y-4">
            {/* Phone Number */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="font-medium text-neutral-900">Phone Number</p>
                  <p className="text-sm text-neutral-600">
                    {profile.phone || 'Add your phone number for security'}
                  </p>
                </div>
              </div>
              {!profile.phone && (
                <button 
                  onClick={handlePhoneRequest}
                  className="btn-trust text-sm"
                >
                  Add Phone
                </button>
              )}
            </div>

            {/* BVN Verification */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="font-medium text-neutral-900">BVN Verification</p>
                  <p className="text-sm text-neutral-600">
                    {profile.bvn ? 'Verified ✓' : 'Verify identity for premium features'}
                  </p>
                </div>
              </div>
              {!profile.bvn && (
                <button 
                  onClick={handleBVNRequest}
                  className="btn-trust text-sm"
                >
                  Verify BVN
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="font-medium text-neutral-900">Location</p>
                  <p className="text-sm text-neutral-600">
                    {profile.location || 'Add location for local connections'}
                  </p>
                </div>
              </div>
              {!profile.location && (
                <button 
                  onClick={handleLocationRequest}
                  className="btn-trust text-sm"
                >
                  Add Location
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Connected Accounts</h2>
          
          <div className="space-y-4">
            {/* Instagram */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Instagram</p>
                  <p className="text-sm text-neutral-600">Cross-post your content</p>
                </div>
              </div>
              <button 
                onClick={() => handleSocialConnect('Instagram')}
                className="btn-vibe-outline text-sm"
              >
                Connect
              </button>
            </div>

            {/* Twitter */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Twitter</p>
                  <p className="text-sm text-neutral-600">Share updates automatically</p>
                </div>
              </div>
              <button 
                onClick={() => handleSocialConnect('Twitter')}
                className="btn-vibe-outline text-sm"
              >
                Connect
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-trust-50 border border-trust-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-trust-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-trust-700">Privacy Protected</p>
                <p className="text-xs text-trust-600 mt-1">
                  All data requests are secured by Trust-Grid. You'll be notified before any information is shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Recent Posts</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-xl flex items-center justify-center">
              <span className="text-neutral-500">📸</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}