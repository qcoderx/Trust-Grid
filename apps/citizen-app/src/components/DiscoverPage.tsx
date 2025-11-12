'use client'

import { useState } from 'react'
import { Search, MapPin, TrendingUp, Users, Hash, Star } from 'lucide-react'

interface DiscoverPageProps {
  onDataRequest: (dataType: string, purpose: string) => void
}

export default function DiscoverPage({ onDataRequest }: DiscoverPageProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'people' | 'topics'>('trending')

  const handleLocationBasedDiscovery = () => {
    onDataRequest('location_data', 'discover nearby users and local content')
  }

  const handlePersonalizedRecommendations = () => {
    onDataRequest('usage_analytics', 'personalized content and user recommendations')
  }

  const trendingPosts = [
    {
      id: 1,
      user: { name: 'Tech Lagos', avatar: 'TL' },
      content: 'Exciting developments in Nigerian fintech! 🚀 #TechLagos #Fintech',
      engagement: '2.3k likes • 456 comments',
      trending: true
    },
    {
      id: 2,
      user: { name: 'Startup Grind', avatar: 'SG' },
      content: 'Join us for the biggest startup event of the year! Registration now open.',
      engagement: '1.8k likes • 234 comments',
      trending: true
    }
  ]

  const suggestedPeople = [
    { id: 1, name: 'Adaora Okafor', username: '@adaora_dev', avatar: 'AO', followers: '12.5k', mutual: 8 },
    { id: 2, name: 'Kemi Adetola', username: '@kemi_design', avatar: 'KA', followers: '8.2k', mutual: 5 },
    { id: 3, name: 'Tunde Bakare', username: '@tunde_tech', avatar: 'TB', followers: '15.1k', mutual: 12 }
  ]

  const trendingTopics = [
    { tag: 'TechLagos', posts: '12.3k posts' },
    { tag: 'NigerianTech', posts: '8.7k posts' },
    { tag: 'StartupLife', posts: '5.4k posts' },
    { tag: 'FinTech', posts: '9.1k posts' },
    { tag: 'Innovation', posts: '15.2k posts' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Discover</h1>
        <p className="text-neutral-600">Find new content, people, and trending topics</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Search for people, topics, or content..."
          className="input-search text-lg py-4"
        />
      </div>

      {/* Personalization Prompts */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Location-based Discovery */}
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 mb-2">Discover Nearby</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Find people and events in your area
              </p>
              <button 
                onClick={handleLocationBasedDiscovery}
                className="btn-trust text-sm"
              >
                Enable Location Discovery
              </button>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 mb-2">Smart Recommendations</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Get personalized content based on your interests
              </p>
              <button 
                onClick={handlePersonalizedRecommendations}
                className="btn-trust text-sm"
              >
                Enable Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-100 rounded-xl p-1 mb-8">
        {[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'people', label: 'People', icon: Users },
          { id: 'topics', label: 'Topics', icon: Hash }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-vibe-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'trending' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">Trending Now</h2>
          {trendingPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="flex items-start space-x-4">
                <div className="avatar w-12 h-12">
                  <span className="text-sm">{post.user.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-neutral-900">{post.user.name}</h3>
                    {post.trending && (
                      <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                        <TrendingUp size={12} />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-800 mb-3">{post.content}</p>
                  <p className="text-sm text-neutral-500">{post.engagement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'people' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">Suggested for You</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestedPeople.map((person) => (
              <div key={person.id} className="card">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="avatar w-16 h-16">
                    <span>{person.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{person.name}</h3>
                    <p className="text-neutral-600 text-sm">{person.username}</p>
                    <p className="text-neutral-500 text-xs">{person.followers} followers</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">{person.mutual} mutual connections</p>
                  <button className="btn-vibe-outline text-sm">Follow</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-neutral-900">Trending Topics</h2>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={topic.tag} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-vibe-100 rounded-lg flex items-center justify-center">
                      <span className="text-vibe-700 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">#{topic.tag}</h3>
                      <p className="text-sm text-neutral-600">{topic.posts}</p>
                    </div>
                  </div>
                  <button className="btn-vibe-outline text-sm">Follow</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}