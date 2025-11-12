'use client'

import { useState } from 'react'
import { Search, MapPin, Phone, Video, MoreHorizontal } from 'lucide-react'

interface MessagesPageProps {
  onDataRequest: (dataType: string, purpose: string) => void
}

export default function MessagesPage({ onDataRequest }: MessagesPageProps) {
  const [conversations] = useState([
    {
      id: 1,
      user: { name: 'Sarah Chen', avatar: 'SC', online: true },
      lastMessage: 'Hey! Are you free for coffee later?',
      timestamp: '2m ago',
      unread: 2
    },
    {
      id: 2,
      user: { name: 'Mike Johnson', avatar: 'MJ', online: false },
      lastMessage: 'Thanks for the recommendation!',
      timestamp: '1h ago',
      unread: 0
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', avatar: 'EW', online: true },
      lastMessage: 'The project looks great so far',
      timestamp: '3h ago',
      unread: 1
    }
  ])

  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  const handleLocationShare = () => {
    onDataRequest('location_data', 'share current location in chat message')
  }

  const handleVideoCall = () => {
    onDataRequest('camera_microphone', 'video call with contact')
  }

  const messages = [
    { id: 1, sender: 'Sarah Chen', content: 'Hey! Are you free for coffee later?', timestamp: '2:30 PM', isMe: false },
    { id: 2, sender: 'Me', content: 'Sure! Where did you have in mind?', timestamp: '2:32 PM', isMe: true },
    { id: 3, sender: 'Sarah Chen', content: 'There\'s this new place downtown I\'ve been wanting to try', timestamp: '2:33 PM', isMe: false },
  ]

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid md:grid-cols-3 h-full bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        
        {/* Conversations List */}
        <div className="border-r border-neutral-200">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-neutral-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="input-search"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                  selectedChat.id === conversation.id ? 'bg-vibe-50 border-r-2 border-r-vibe-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="avatar w-12 h-12">
                      <span className="text-sm">{conversation.user.avatar}</span>
                    </div>
                    {conversation.user.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-900 truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-neutral-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 bg-vibe-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="avatar w-10 h-10">
                    <span className="text-sm">{selectedChat.user.avatar}</span>
                  </div>
                  {selectedChat.user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900">{selectedChat.user.name}</h2>
                  <p className="text-sm text-neutral-600">
                    {selectedChat.user.online ? 'Active now' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleVideoCall}
                  className="btn-ghost"
                >
                  <Video size={20} />
                </button>
                <button className="btn-ghost">
                  <Phone size={20} />
                </button>
                <button className="btn-ghost">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isMe 
                    ? 'bg-vibe-600 text-white' 
                    : 'bg-neutral-100 text-neutral-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isMe ? 'text-vibe-200' : 'text-neutral-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-neutral-200">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full p-3 border border-neutral-300 rounded-xl resize-none focus:ring-2 focus:ring-vibe-500 focus:border-transparent"
                  rows={1}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleLocationShare}
                      className="flex items-center space-x-2 text-neutral-600 hover:text-vibe-600 transition-colors"
                    >
                      <MapPin size={18} />
                      <span className="text-sm">Share Location</span>
                    </button>
                  </div>
                  
                  <button 
                    disabled={!newMessage.trim()}
                    className="btn-vibe disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}