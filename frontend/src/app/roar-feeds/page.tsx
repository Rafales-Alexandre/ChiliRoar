"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// Fonction pour générer des avatars avec DiceBear
const generateAvatar = (name: string, style: 'adventurer' | 'avataaars' | 'big-ears' | 'bottts' | 'croodles' | 'fun-emoji' = 'adventurer') => {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Fonction pour obtenir les initiales d'un nom
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Fonction pour générer une couleur basée sur le nom
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Composant Avatar avec fallback
const Avatar = ({ src, name, size = 'w-10 h-10' }: { src?: string; name: string; size?: string }) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  if (!src || imageError) {
    return (
      <div className={`${size} ${bgColor} rounded-full flex items-center justify-center text-white text-sm font-bold border border-gray-700`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className={`${size} rounded-full border border-gray-700 object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

const filters = ['🔥 Top Roars', '⭐ Emerging Roars', '📈 Trending', '🆕 Latest'];
const timeFilters = ['24H', '7D', '30D', 'All Time'];

const top10 = [
  { rank: 1, avatar: generateAvatar('Nick Ducoff'), name: 'Nick Ducoff', tag: '@nickducoff', badge: 'gold', roars: 306 },
  { rank: 2, avatar: generateAvatar('based16z'), name: 'based16z', tag: '@based16z', badge: 'silver', roars: 232 },
  { rank: 3, avatar: generateAvatar('Mosi'), name: 'Mosi', tag: '@VannaCharmer', badge: 'bronze', roars: 224 },
  { rank: 4, avatar: generateAvatar('mary'), name: 'mary', tag: '@howdymerry', roars: 187 },
  { rank: 5, avatar: generateAvatar('mert helius.dev'), name: 'mert | helius.dev', tag: '@0xMert_', roars: 186 },
  { rank: 6, avatar: generateAvatar('moon'), name: 'moon', tag: '@MoonOverlord', roars: 158 },
  { rank: 7, avatar: generateAvatar('Makina'), name: 'Makina', tag: '@makinafi', roars: 149 },
  { rank: 8, avatar: generateAvatar('Wazz'), name: 'Wazz', tag: '@WazzCrypto', roars: 127 },
  { rank: 9, avatar: generateAvatar('Noah'), name: 'Noah', tag: '@redacted_noah', roars: 108 },
  { rank: 10, avatar: generateAvatar('ZenLlama'), name: 'ZenLlama', tag: '@zen_llama', roars: 95 },
];

const badgeIcons: Record<string, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' };

const posts = [
  {
    avatar: generateAvatar('based16z'),
    name: 'based16z',
    tag: '@based16z',
    time: '26h',
    smartFollowers: 3235,
    lifetimeRoars: 7604,
    text: `Voici mes retours crypto par année.\nJe parie sur les perps et je m'amuse sur la chaîne, mais la plupart de mes gains viennent de 1 ou 2 paris par an\n\n2020 - Calls Bitcoin OTM sur ledgerx et spot eth\n2021 - Loot NFTs, Solana, Solana Monkey Business NFTs\n2022 - Pas tradé, fini mes études\n2023 - Rollbit, airdrop Blur\n2024 - Hype\n\nLa clé : être patient et attendre les bonnes opportunités.`,
    showMore: true,
    likes: 1247,
    reposts: 89,
    comments: 156,
    image: '/chiliRoarBanner.png',
  },
  {
    avatar: generateAvatar('Nick Ducoff'),
    name: 'Nick Ducoff',
    tag: '@nickducoff',
    time: '2h',
    smartFollowers: 94936,
    lifetimeRoars: 15420,
    text: `🚀 ChiliRoar continue de grandir !\n\nLes FanTokens prennent de l'ampleur et la communauté devient de plus en plus active. C'est incroyable de voir l'engagement autour des équipes et des clubs.\n\nQuel est votre FanToken préféré ? ⚽🎮`,
    showMore: false,
    likes: 892,
    reposts: 234,
    comments: 67,
  },
  {
    avatar: generateAvatar('Mosi'),
    name: 'Mosi',
    tag: '@VannaCharmer',
    time: '5h',
    smartFollowers: 12724,
    lifetimeRoars: 8920,
    text: `Analysant les tendances du marché des FanTokens aujourd'hui. PSG et OG continuent de dominer, mais je vois des mouvements intéressants sur ASR et quelques nouveaux arrivants.\n\nLe sentiment général reste très positif ! 📈`,
    showMore: false,
    likes: 567,
    reposts: 123,
    comments: 89,
  },
];

function RoarFeedFilters({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  return (
    <div className="flex gap-6 border-b border-gray-800 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          className={`py-3 px-4 text-lg font-semibold border-b-2 transition-colors duration-200 ${
            active === f 
              ? 'border-green-400 text-green-300 bg-green-400/10 rounded-t-lg' 
              : 'border-transparent text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-t-lg'
          }`}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function TimeFilters({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  return (
    <div className="flex gap-2 mb-6">
      {timeFilters.map((f) => (
        <button
          key={f}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
            active === f 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function RoarFeedPost({ post }: { post: typeof posts[0] }) {
  const [showFullText, setShowFullText] = useState(false);
  const displayText = showFullText ? post.text : post.text.slice(0, 200) + (post.text.length > 200 ? '...' : '');

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow-lg border border-gray-800 hover:border-gray-700 transition-colors duration-200">
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={post.avatar} name={post.name} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white">{post.name}</span>
            <span className="text-gray-400">{post.tag}</span>
            <span className="text-xs text-gray-500">· {post.time}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            {post.smartFollowers.toLocaleString()} Smart Followers &nbsp; • &nbsp; {post.lifetimeRoars.toLocaleString()} Lifetime Roars
          </div>
        </div>
      </div>
      
      <div className="whitespace-pre-line text-gray-200 mb-4 leading-relaxed">
        {displayText}
      </div>
      
      {post.text.length > 200 && (
        <button 
          className="text-green-400 text-sm hover:underline mb-4 transition-colors duration-200"
          onClick={() => setShowFullText(!showFullText)}
        >
          {showFullText ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
      
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4 border border-gray-800 bg-black">
          <img src={post.image} alt="Post content" className="w-full h-auto" />
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-400">
        <button className="flex items-center gap-2 hover:text-red-400 transition-colors duration-200">
          <span className="text-lg">❤️</span>
          <span className="text-sm">{post.likes.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-green-400 transition-colors duration-200">
          <span className="text-lg">🔄</span>
          <span className="text-sm">{post.reposts.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
          <span className="text-lg">💬</span>
          <span className="text-sm">{post.comments.toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-purple-400 transition-colors duration-200">
          <span className="text-lg">📤</span>
          <span className="text-sm">Partager</span>
        </button>
      </div>
    </div>
  );
}

function RoarFeedSidebar() {
  return (
    <aside className="bg-gray-900 rounded-xl p-6 w-80 ml-8 shadow-lg border border-gray-800 flex flex-col h-fit">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-xl text-white">🏆 Top 10 Roars</span>
        <div className="flex gap-1">
          <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium">24H</button>
        </div>
      </div>
      
      <a href="/roars" className="text-green-400 text-sm mb-4 hover:underline transition-colors duration-200">
        Voir le classement complet &gt;
      </a>
      
      <ol className="space-y-3">
        {top10.map((roar) => (
          <li key={roar.rank} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
            roar.badge 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' 
              : 'hover:bg-gray-800/50'
          }`}>
            <span className={`w-6 text-center font-bold text-lg ${
              roar.badge === 'gold' ? 'text-yellow-300' : 
              roar.badge === 'silver' ? 'text-gray-300' : 
              roar.badge === 'bronze' ? 'text-orange-400' : 'text-gray-400'
            }`}>
              {roar.badge ? badgeIcons[roar.badge] : `#${roar.rank}`}
            </span>
            <Avatar src={roar.avatar} name={roar.name} size="w-8 h-8" />
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">{roar.name}</div>
              <div className="text-xs text-gray-400 truncate">{roar.tag}</div>
            </div>
            <div className="text-xs text-green-400 font-medium">{roar.roars}</div>
          </li>
        ))}
      </ol>
      
      {/* Statistiques rapides */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <h3 className="font-semibold text-white mb-3">📊 Statistiques</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Roars</span>
            <span className="text-white font-medium">1,847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Créateurs actifs</span>
            <span className="text-white font-medium">156</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Engagement moyen</span>
            <span className="text-green-400 font-medium">8.2%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function RoarFeedsPage() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [activeTime, setActiveTime] = useState(timeFilters[0]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header avec statistiques */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-300 mb-2">🦁 Roar Feeds</h1>
          <p className="text-gray-400 mb-6">
            Restez proche de là où l'attention se concentre sur ChiliRoar
          </p>
          
          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-500/20">
              <div className="text-2xl font-bold text-white">{posts.length}</div>
              <div className="text-sm text-gray-300">Posts Aujourd'hui</div>
            </div>
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-white">2.4K</div>
              <div className="text-sm text-gray-300">Total Likes</div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-white">456</div>
              <div className="text-sm text-gray-300">Reposts</div>
            </div>
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/20">
              <div className="text-2xl font-bold text-white">312</div>
              <div className="text-sm text-gray-300">Commentaires</div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <RoarFeedFilters active={activeFilter} onChange={setActiveFilter} />
            <TimeFilters active={activeTime} onChange={setActiveTime} />
            {posts.map((post, i) => (
              <RoarFeedPost key={i} post={post} />
            ))}
          </div>
          <RoarFeedSidebar />
        </div>
      </main>
    </div>
  );
} 