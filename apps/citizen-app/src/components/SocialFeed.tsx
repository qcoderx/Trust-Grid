'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share, MapPin, Camera, Instagram, MoreHorizontal } from 'lucide-react'

interface SocialFeedProps {
  onDataRequest: (dataType: string, purpose: string) => void
}

export default function SocialFeed({ onDataRequest }: SocialFeedProps) {
  const [posts] = useState([
    {
      id: 1,
      user: { name: 'Sarah Chen', username: '@sarahc', avatar: 'SC' },
      content: 'Just had the most amazing coffee at this new place downtown! ☕️',
      image: null,
      likes: 24,
      comments: 8,
      timestamp: '2h ago',
      hasLocation: false
    },
    {
      id: 2,
      user: { name: 'Mike Johnson', username: '@mikej', avatar: 'MJ' },
      content: 'Beautiful sunset from my balcony tonight 🌅',
      image: '/api/placeholder/400/300',
      likes: 156,
      comments: 23,
      timestamp: '4h ago',
      hasLocation: true
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', username: '@emmaw', avatar: 'EW' },
      content: 'Working on some exciting new projects! Can\'t wait to share more soon 🚀',
      image: null,
      likes: 89,
      comments: 12,
      timestamp: '6h ago',
      hasLocation: false
    }
  ])

  const [newPost, setNewPost] = useState('')

  const handleLocationRequest = () => {
    onDataRequest('location_data', 'add location to social media post')
  }

  const handleInstagramConnect = () => {
    onDataRequest('social_accounts', 'cross-post content to Instagram')
  }

  const handleAnalyticsRequest = () => {
    onDataRequest('usage_analytics', 'personalized content recommendations')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post */}
      <div className="post-card mb-6">
        <div className="flex items-start space-x-4">
          <div className="avatar w-12 h-12">
            <span>A</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind, Ayo?"
              className="w-full p-3 border border-neutral-200 rounded-xl resize-none focus:ring-2 focus:ring-vibe-500 focus:border-transparent"
              rows={3}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLocationRequest}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors"
                >
                  <MapPin size={20} />
                  <span className="text-sm">Add Location</span>
                </button>
                
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors">
                  <Camera size={20} />
                  <span className="text-sm">Photo</span>
                </button>
                
                <button 
                  onClick={handleInstagramConnect}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors"
                >
                  <Instagram size={20} />
                  <span className="text-sm">Cross-post</span>
                </button>
              </div>
              
              <button 
                disabled={!newPost.trim()}
                className="btn-vibe disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Prompt */}
      <div className="bg-gradient-to-r from-vibe-50 to-accent-50 border border-vibe-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-vibe-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-2">Get Personalized Content</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Enable smart recommendations to see content tailored just for you
            </p>
            <button 
              onClick={handleAnalyticsRequest}
              className="btn-vibe-outline text-sm"
            >
              Enable Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="avatar w-10 h-10">
                  <span className="text-sm">{post.user.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">{post.user.name}</h4>
                  <p className="text-sm text-neutral-500">{post.user.username} • {post.timestamp}</p>
                </div>
              </div>
              <button className="btn-ghost">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-neutral-800 mb-4">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <div className="mb-4 rounded-xl overflow-hidden bg-neutral-100">
                <div className="w-full h-64 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <span className="text-neutral-500">📸 Image Placeholder</span>
                </div>
              </div>
            )}

            {/* Location Badge */}
            {post.hasLocation && (
              <div className="flex items-center space-x-1 text-neutral-500 text-sm mb-4">
                <MapPin size={16} />
                <span>Downtown Coffee District</span>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors">
                  <Share size={20} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}