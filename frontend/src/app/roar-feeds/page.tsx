"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

interface RoarPost {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  fanToken?: string;
  image?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// Function to generate avatars with DiceBear
const generateAvatar = (name: string) => {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};

const mockPosts: RoarPost[] = [
  {
    id: '1',
    author: {
      name: 'Nick Ducoff',
      handle: '@nickducoff',
      avatar: generateAvatar('Nick Ducoff'),
      verified: true,
      followers: 94936
    },
    content: 'Just completed my first PSG FanToken trade! The liquidity is incredible and the community is so active. This is exactly what I was looking for in a FanToken platform. 🚀 #PSG #FanTokens #ChiliRoar',
    timestamp: '2 hours ago',
    likes: 324,
    comments: 45,
    shares: 12,
    tags: ['PSG', 'FanTokens', 'ChiliRoar'],
    fanToken: 'PSG',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '2',
    author: {
      name: 'based16z',
      handle: '@based16z',
      avatar: generateAvatar('based16z'),
      verified: false,
      followers: 9378
    },
    content: 'OG token holders, what\'s your take on the recent price action? I think we\'re seeing some healthy consolidation before the next leg up. The fundamentals are still strong. 📈 #OG #Esports #Gaming',
    timestamp: '4 hours ago',
    likes: 156,
    comments: 23,
    shares: 8,
    tags: ['OG', 'Esports', 'Gaming'],
    fanToken: 'OG',
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '3',
    author: {
      name: 'Mosi',
      handle: '@VannaCharmer',
      avatar: generateAvatar('Mosi'),
      verified: false,
      followers: 12724
    },
    content: 'ASR community is absolutely amazing! The discussions about AS Roma are top-notch and the token utility keeps getting better. Forza Roma! 🔴🟡 #ASR #ASRoma #Football',
    timestamp: '6 hours ago',
    likes: 89,
    comments: 15,
    shares: 5,
    tags: ['ASR', 'ASRoma', 'Football'],
    fanToken: 'ASR',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '4',
    author: {
      name: 'mary',
      handle: '@howdymerry',
      avatar: generateAvatar('mary'),
      verified: true,
      followers: 238711
    },
    content: 'New to ChiliRoar? Here\'s my beginner\'s guide to getting started with FanTokens: 1) Connect your wallet 2) Browse available tokens 3) Start with small amounts 4) Join the community discussions. It\'s that simple! 💡 #Beginner #Guide #FanTokens',
    timestamp: '8 hours ago',
    likes: 567,
    comments: 78,
    shares: 34,
    tags: ['Beginner', 'Guide', 'FanTokens'],
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '5',
    author: {
      name: 'mert | helius.dev',
      handle: '@0xMert_',
      avatar: generateAvatar('mert'),
      verified: true,
      followers: 303359
    },
    content: 'Technical analysis on PSG FanToken: We\'re seeing a bullish flag pattern forming on the 4H chart. Key resistance at $1.50, support at $1.35. Volume is increasing which is a good sign. 🎯 #TechnicalAnalysis #PSG #Trading',
    timestamp: '12 hours ago',
    likes: 234,
    comments: 41,
    shares: 18,
    tags: ['TechnicalAnalysis', 'PSG', 'Trading'],
    fanToken: 'PSG',
    isLiked: true,
    isBookmarked: true
  },
  {
    id: '6',
    author: {
      name: 'moon',
      handle: '@MoonOverlord',
      avatar: generateAvatar('moon'),
      verified: false,
      followers: 1720
    },
    content: 'Just discovered the OG community here. The level of discussion about Dota 2 and esports is incredible. Much better than other platforms I\'ve tried. Kudos to the ChiliRoar team! 👏 #OG #Dota2 #Esports',
    timestamp: '1 day ago',
    likes: 67,
    comments: 12,
    shares: 3,
    tags: ['OG', 'Dota2', 'Esports'],
    fanToken: 'OG',
    isLiked: false,
    isBookmarked: false
  }
];

export default function RoarFeedsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'PSG' | 'OG' | 'ASR' | 'trending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = mockPosts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || 
                         selectedFilter === 'trending' || 
                         post.fanToken === selectedFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'trending') {
      return matchesSearch && post.likes > 200;
    }
    
    return matchesFilter && matchesSearch;
  });

  const handleLike = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId);
  };

  const handleBookmark = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Bookmarked post:', postId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/Roar.png" alt="Roar Feeds" className="w-8 h-8 mr-3" />
            Roar Feeds
          </h1>
          <p className="text-gray-300 mb-6">
            Discover the latest content, discussions, and insights from the ChiliRoar community
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <span className="text-gray-300 text-sm font-medium flex items-center">Filter:</span>
              {(['all', 'trending', 'PSG', 'OG', 'ASR'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filter === 'all' ? 'All Posts' :
                   filter === 'trending' ? 'Trending' : filter}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts, users, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{post.author.name}</h3>
                      {post.author.verified && (
                        <img src="/trophy.png" alt="Verified" className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{post.author.handle}</p>
                    <p className="text-xs text-gray-500">{formatNumber(post.author.followers)} followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {post.fanToken && (
                    <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full">
                      {post.fanToken}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{post.timestamp}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-white mb-3">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="w-full rounded-lg mb-3"
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full hover:bg-gray-700 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <img src="/Roar.png" alt="Like" className="w-4 h-4" />
                    {formatNumber(post.likes)}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    <img src="/leaderboard.png" alt="Comment" className="w-4 h-4" />
                    {formatNumber(post.comments)}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
                    <img src="/airdrop.png" alt="Share" className="w-4 h-4" />
                    {formatNumber(post.shares)}
                  </button>
                </div>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`text-sm transition-colors ${
                    post.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <img src="/price.png" alt="Bookmark" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <img src="/Roar.png" alt="No posts" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No posts found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 