'use client'

import { useState } from 'react'
import { Home, User, MessageCircle, Search, Settings, Shield } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  hasNotification?: boolean
}

export default function Navigation({ currentPage, onPageChange, hasNotification }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 z-40 md:hidden">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            const showNotification = item.id === 'settings' && hasNotification
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} relative`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
                {showNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:border-r md:border-neutral-200 z-40">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-vibe rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SocialVibe</h1>
              <p className="text-xs text-neutral-500">Connect Authentically</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            const showNotification = item.id === 'settings' && hasNotification
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-vibe-100 text-vibe-700 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {showNotification && (
                  <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Trust-Grid Badge */}
        <div className="px-4 pb-6">
          <div className="bg-trust-50 border border-trust-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-trust-600" />
              <span className="text-sm font-semibold text-trust-700">Protected by Trust-Grid</span>
            </div>
            <p className="text-xs text-trust-600">
              Your data is secured with AI-powered privacy protection
            </p>
          </div>
        </div>
      </div>
    </>
  )
}