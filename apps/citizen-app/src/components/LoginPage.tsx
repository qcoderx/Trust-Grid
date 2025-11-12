'use client'

import { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'

interface LoginPageProps {
  onLogin: (username: string, password: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('ayo')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  const handleDemoLogin = () => {
    onLogin('ayo', 'password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-vibe p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
            <span className="text-3xl font-bold gradient-text">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            SocialVibe
          </h1>
          <p className="text-vibe-100 text-lg">
            Connect Authentically
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-600">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-vibe"
            >
              Sign In
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Demo Access</span>
              </div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              className="w-full mt-4 btn-vibe-outline"
            >
              Continue as Ayo (Demo)
            </button>
          </div>

          {/* Trust-Grid Badge */}
          <div className="mt-6 p-4 bg-trust-50 border border-trust-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-trust-600" />
              <div>
                <p className="text-sm font-medium text-trust-700">Protected by Trust-Grid</p>
                <p className="text-xs text-trust-600">AI-powered privacy protection</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-vibe-100">
            Don't have an account? <span className="text-white font-medium">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  )
}
