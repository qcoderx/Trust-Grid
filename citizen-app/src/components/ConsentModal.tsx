'use client'

import { useState } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'

interface ConsentModalProps {
  request: {
    _id: string
    org_id: string
    data_type: string
    purpose: string
  }
  onRespond: (requestId: string, response: 'approved' | 'denied') => void
}

export default function ConsentModal({ request, onRespond }: ConsentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleResponse = async (response: 'approved' | 'denied') => {
    setIsLoading(true)
    await onRespond(request._id, response)
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-trust-accent bg-opacity-10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-trust-accent" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Data Access Request
          </h2>
          <p className="text-neutral-600">
            An organization wants to access your data
          </p>
        </div>

        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {request.org_id} is requesting:
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-neutral-700">Data Type:</span>
              <span className="ml-2 text-neutral-600 uppercase">{request.data_type}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Purpose:</span>
              <span className="ml-2 text-neutral-600">{request.purpose}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleResponse('approved')}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Approve Request'}
          </button>

          <button
            onClick={() => handleResponse('denied')}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Deny Request'}
          </button>
        </div>

        <p className="text-xs text-neutral-500 text-center mt-4">
          Your decision will be recorded in your transparency log
        </p>
      </div>
    </div>
  )
}
