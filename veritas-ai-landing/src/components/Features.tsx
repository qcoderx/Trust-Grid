import { AlertTriangle, MessageCircle, TrendingUp } from 'lucide-react'

const features = [
  {
    title: 'Fraud Risk Score',
    description: 'Get an instant, mathematically derived fraud confidence score upon analysis completion. No more gut feelings.',
    icon: TrendingUp,
    visual: '92%'
  },
  {
    title: 'Key Risk Factors',
    description: 'The AI explicitly flags timeline contradictions, content conflicts, and digital tampering with direct evidence citations.',
    icon: AlertTriangle,
    visual: 'Evidence-backed bullets'
  },
  {
    title: 'Conversational Co-Pilot',
    description: 'Empower adjusters with an Amazon Q co-pilot, indexed with all claim data, to answer deep-dive questions instantly.',
    icon: MessageCircle,
    visual: 'Chat interface'
  }
]

export default function Features() {
  return (
    <section className="section-padding bg-gray-900">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-emerald">
        The Verdict: Forensic Precision
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="bg-deep-indigo p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <Icon size={48} className="text-emerald mr-4" />
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <div className="text-emerald font-semibold text-lg">
                {feature.visual}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
