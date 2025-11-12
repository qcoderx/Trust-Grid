'use client'

import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Request {
  _id: string
  org_id: string
  user_id: string
  data_type: string
  purpose: string
  status: 'pending' | 'approved' | 'denied'
  timestamp_requested: string
}

interface DashboardProps {
  user: { id: string; username: string }
  requests: Request[]
}

export default function Dashboard({ user, requests }: DashboardProps) {
  const completedRequests = requests.filter(req => req.status !== 'pending')

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50'
      case 'denied':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-yellow-700 bg-yellow-50'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-trust-accent" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Trust-Grid</h1>
                <p className="text-sm text-neutral-600">Welcome back, {user.username}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Your Data Transparency Log
          </h2>
          <p className="text-neutral-600">
            View all organizations that have requested access to your data and their current status.
          </p>
        </div>

        {completedRequests.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No requests yet
            </h3>
            <p className="text-neutral-600">
              Organizations will appear here when they request access to your data.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedRequests.map((request) => (
              <div key={request._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="font-medium text-neutral-900 capitalize">
                        {request.status}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {new Date(request.timestamp_requested).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Data Type</p>
                    <p className="text-sm text-neutral-600 uppercase">{request.data_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Purpose</p>
                    <p className="text-sm text-neutral-600">{request.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Organization</p>
                    <p className="text-sm text-neutral-600">{request.org_id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
