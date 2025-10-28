'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-indigo to-black relative overflow-hidden">
      {/* Subtle animation background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`text-center z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald to-white bg-clip-text text-transparent">
          VERITAS AI: The Digital Truth Engine.
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Stop Fraud in 10 Minutes, Not 10 Days. A fully automated, forensic AI platform that turns unstructured claims data into an evidence-backed verdict and actionable intelligence.
        </p>
        <button className="btn-primary">
          Request an Executive Demo
        </button>
      </div>
    </section>
  )
}
