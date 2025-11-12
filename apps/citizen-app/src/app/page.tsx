'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import LoginPage from '@/components/LoginPage'
import Navigation from '@/components/Navigation'
import SocialFeed from '@/components/SocialFeed'
import ProfilePage from '@/components/ProfilePage'
import MessagesPage from '@/components/MessagesPage'
import DiscoverPage from '@/components/DiscoverPage'
import SettingsPage from '@/components/SettingsPage'
import PrivacySettings from '@/components/PrivacySettings'
import ConsentModal from '@/components/ConsentModal'

type Page = 'home' | 'profile' | 'messages' | 'discover' | 'settings' | 'privacy'

export default function Home() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [processedRequests, setProcessedRequests] = useState<Set<string>>(new Set())
  const [mockRequests, setMockRequests] = useState<any[]>([])

  // Mock login for demo
  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setUser({ id: 'ayo', username: 'Ayo' })
      // Initialize with some mock historical data
      setMockRequests([
        {
          _id: 'hist_1',
          org_id: 'org1',
          user_id: 'ayo',
          data_type: 'email',
          purpose: 'newsletter subscription',
          status: 'approved',
          timestamp_requested: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          timestamp_responded: new Date(Date.now() - 86400000 + 300000).toISOString(), // 5 min later
        },
        {
          _id: 'hist_2',
          org_id: 'org3',
          user_id: 'ayo',
          data_type: 'location_data',
          purpose: 'location-based services',
          status: 'denied',
          timestamp_requested: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          timestamp_responded: new Date(Date.now() - 172800000 + 180000).toISOString(), // 3 min later
        }
      ])
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('home')
    setPendingRequests([])
    setProcessedRequests(new Set())
    setMockRequests([])
  }

  // Handle data requests from social features
  const handleDataRequest = (dataType: string, purpose: string) => {
    const newRequest = {
      _id: `req_${Date.now()}`,
      org_id: 'socialvibe',
      user_id: user?.id || 'ayo',
      data_type: dataType,
      purpose: purpose,
      status: 'pending' as const,
      timestamp_requested: new Date().toISOString(),
    }
    
    setMockRequests(prev => [...prev, newRequest])
    
    // Show toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-vibe-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-up'
    toast.textContent = 'Processing data request...'
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 2000)
  }

  // Fetch consent requests (includes mock data)
  const { data: requests = [] } = useQuery({
    queryKey: ['consent-requests', user?.id, mockRequests.length],
    queryFn: async () => {
      if (!user) return []
      return mockRequests
    },
    enabled: !!user,
    refetchInterval: 3000, // Poll every 3 seconds
  })

  useEffect(() => {
    if (requests) {
      const pending = requests.filter((req: any) => req.status === 'pending' && !processedRequests.has(req._id))
      setPendingRequests(pending)
    }
  }, [requests, processedRequests])

  const handleConsentResponse = async (requestId: string, response: 'approved' | 'denied') => {
    // Update the request status
    setMockRequests(prev => prev.map(req => 
      req._id === requestId 
        ? { ...req, status: response, timestamp_responded: new Date().toISOString() }
        : req
    ))
    
    setProcessedRequests(prev => new Set([...prev, requestId]))
    setPendingRequests([])
    
    // Show success toast
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-up text-white ${
      response === 'approved' ? 'bg-green-600' : 'bg-red-600'
    }`
    toast.textContent = `Request ${response}! Added to transparency log.`
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page)
  }

  const handleBackToSettings = () => {
    setCurrentPage('settings')
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  const hasPendingRequests = pendingRequests.length > 0

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        hasNotification={hasPendingRequests}
      />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-8">
        <div className="p-4 md:p-8">
          {currentPage === 'home' && (
            <SocialFeed onDataRequest={handleDataRequest} />
          )}
          
          {currentPage === 'profile' && (
            <ProfilePage onDataRequest={handleDataRequest} />
          )}
          
          {currentPage === 'messages' && (
            <MessagesPage onDataRequest={handleDataRequest} />
          )}
          
          {currentPage === 'discover' && (
            <DiscoverPage onDataRequest={handleDataRequest} />
          )}
          
          {currentPage === 'settings' && (
            <SettingsPage 
              onNavigate={handlePageChange}
              onLogout={handleLogout}
              hasNotification={hasPendingRequests}
            />
          )}
          
          {currentPage === 'privacy' && (
            <PrivacySettings 
              user={user}
              requests={requests}
              onBack={handleBackToSettings}
            />
          )}
        </div>
      </main>

      {/* Consent Modal */}
      {pendingRequests.length > 0 && (
        <ConsentModal
          request={pendingRequests[0]}
          onRespond={handleConsentResponse}
        />
      )}
    </div>
  )
}
