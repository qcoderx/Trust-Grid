'use client'

import { useEffect, useState } from 'react'
import { FileText, Zap, Brain, MessageSquare } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'The Claims Gateway: Data In',
    description: 'Zero Learning Curve. Adjusters simply upload unstructured claims data—no complex setup required.',
    icon: FileText,
    benefit: 'Complete, Automated Data Extraction.'
  },
  {
    id: 2,
    title: 'The AI Pipeline: Intelligence Harvest',
    description: 'Parallel AI processing with Textract, Rekognition, and Reverse Search extracts every detail instantly.',
    icon: Zap,
    benefit: 'Lightning-fast, comprehensive data harvesting.'
  },
  {
    id: 3,
    title: 'The Verdict: Bedrock Connects the Dots',
    description: 'Claude 3 Sonnet analyzes with the Master Prompt, eliminating subjectivity through forensic protocol.',
    icon: Brain,
    benefit: 'Evidence-backed verdicts with zero bias.'
  },
  {
    id: 4,
    title: 'The Co-Pilot: Actionable Intelligence',
    description: 'Amazon Q co-pilot answers deep-dive questions, indexed with all claim data for rapid decision-making.',
    icon: MessageSquare,
    benefit: 'Conversational, evidence-based investigations.'
  }
]

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.workflow-step')
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveStep(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="section-padding bg-black">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-emerald">
        The Complete Veritas AI Workflow
      </h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-emerald/30"></div>

        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === activeStep

          return (
            <div
              key={step.id}
              className={`workflow-step flex items-start mb-16 transition-all duration-500 ${
                isActive ? 'opacity-100 scale-105' : 'opacity-70 scale-100'
              }`}
            >
              <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-8 transition-all duration-500 ${
                isActive ? 'bg-emerald text-deep-indigo' : 'bg-gray-700 text-gray-400'
              }`}>
                <Icon size={32} />
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${
                  isActive ? 'text-emerald' : 'text-white'
                }`}>
                  {step.title}
                </h3>
                <p className="text-gray-300 text-lg mb-2">{step.description}</p>
                <p className="text-emerald font-semibold">{step.benefit}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
