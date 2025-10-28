'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import LoginPage from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'
import ConsentModal from '@/components/ConsentModal'

export default function Home() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])

  // Mock login for demo
  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setUser({ id: 'ayo', username })
    }
  }

  // Fetch consent requests
  const { data: requests = [] } = useQuery({
    queryKey: ['consent-requests', user?.id],
    queryFn: async () => {
      if (!user) return []
      // Mock API call
      return [
        {
          _id: '1',
          org_id: 'org1',
          user_id: user.id,
          data_type: 'email',
          purpose: 'newsletter',
          status: 'approved',
          timestamp_requested: new Date().toISOString(),
        },
        {
          _id: '2',
          org_id: 'org2',
          user_id: user.id,
          data_type: 'bvn',
          purpose: 'KYC verification',
          status: 'pending',
          timestamp_requested: new Date().toISOString(),
        },
      ]
    },
    enabled: !!user,
    refetchInterval: 3000, // Poll every 3 seconds
  })

  useEffect(() => {
    if (requests) {
      const pending = requests.filter((req: any) => req.status === 'pending')
      setPendingRequests(pending)
    }
  }, [requests])

  const handleConsentResponse = async (requestId: string, response: 'approved' | 'denied') => {
    // Mock API call to respond to consent
    console.log(`Responding to request ${requestId} with ${response}`)
    setPendingRequests([])
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Dashboard user={user} requests={requests} />
      {pendingRequests.length > 0 && (
        <ConsentModal
          request={pendingRequests[0]}
          onRespond={handleConsentResponse}
        />
      )}
    </div>
  )
}
