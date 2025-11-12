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

  const getOrgName = (orgId: string) => {
    const orgNames: { [key: string]: string } = {
      'org1': 'SME-Femi\'s Site',
      'org2': 'TechCorp Nigeria',
      'org3': 'FinanceApp Ltd',
      'socialvibe': 'SocialVibe'
    }
    return orgNames[orgId] || orgId
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-trust rounded-2xl mb-6 animate-bounce-gentle">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Data Access Request
          </h2>
          <p className="text-neutral-600">
            An organization is requesting access to your data
          </p>
        </div>

        {/* Request Details - PRD Format */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">
                {getOrgName(request.org_id)} is Requesting:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="font-semibold text-neutral-700">Data:</span>
                  <span className="font-bold text-neutral-900 uppercase tracking-wide">
                    {request.data_type.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="font-semibold text-neutral-700">Purpose:</span>
                  <span className="font-bold text-neutral-900 text-right flex-1 ml-4">
                    {request.purpose}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - PRD Format */}
        <div className="space-y-4">
          <button
            onClick={() => handleResponse('approved')}
            disabled={isLoading}
            className="w-full btn-approve py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Approve'
            )}
          </button>

          <button
            onClick={() => handleResponse('denied')}
            disabled={isLoading}
            className="w-full btn-deny py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Deny'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-trust-50 border border-trust-200 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-trust-600" />
            <span className="text-sm font-semibold text-trust-700">Trust-Grid Protected</span>
          </div>
          <p className="text-xs text-trust-600">
            Your decision will be permanently recorded in your transparency log. 
            This request has been verified by AI compliance checking.
          </p>
        </div>
      </div>
    </div>
  )
}
