"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LoginModal from '../components/LoginModal';
import { useWallet } from './contexts/WalletContext';
import { useAuth } from './contexts/AuthContext';
import MissingConfig from '../components/MissingConfig';
import AuthTest from '../components/AuthTest';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { isConnected, account } = useWallet();
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Show login modal after 2 seconds only if not authenticated
    if (!user && !authLoading) {
      const loginTimer = setTimeout(() => {
        setShowLoginModal(true);
      }, 2000);

      return () => clearTimeout(loginTimer);
    }
  }, [user, authLoading]);

  // Start video as soon as it's loaded
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsVideoLoaded(true);
  };

  // Afficher le composant de configuration manquante si nécessaire
  if (authError === 'Configuration manquante') {
    return <MissingConfig />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>
        ) : (
          // Animated fallback if video is not available
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            {/* Animated waves */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-96 h-96 border border-green-400/30 rounded-full animate-ping"></div>
                <div className="w-80 h-80 border border-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="w-64 h-64 border border-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-8">
          <div className="flex items-center">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
            <span className="text-2xl font-bold text-white">ChiliRoar</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="bg-green-600 px-3 py-2 rounded-lg text-white text-sm font-medium">
                  <img src="/dashboard.png" alt="Connected" className="w-4 h-4 inline mr-2" />
                  {user.name || user.email || 'Utilisateur'}
                </div>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Se connecter
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Welcome to the
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Arena
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate platform for FanTokens, Roars and community engagement
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <img src='dashboard.png' alt='Dashboard' className='w-8 h-8 mr-3' />
                  Accéder au Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <img src="/arena.png" alt="Start" className="w-8 h-8 mr-3" />
                  Commencer l'Aventure
                </button>
              )}
              
              <Link
                href="/fan-tokens"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-200 flex items-center justify-center"
              >
                <img src='trophy.png' alt='FanTokens' className='w-8 h-8 mr-3' />
                Discover FanTokens
              </Link>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Why ChiliRoar ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <img src='trophy.png' alt='FanTokens' className='w-12 h-12' />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Premium FanTokens</h3>
                <p className="text-gray-300">
                  Access the best FanTokens in the world: PSG, OG, ASR and many more
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <img src='Roar.png' alt='Roars' className='w-12 h-12' />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Roars & Engagement</h3>
                <p className="text-gray-300">
                  Participate in the community, create content and earn rewards
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <img src='price.png' alt='Earn' className='w-12 h-12' />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Earn & Rewards</h3>
                <p className="text-gray-300">
                  Earn tokens by completing missions and participating in airdrops
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-8 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-gray-300">FanTokens</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-gray-300">Users</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-purple-400 mb-2">$2M+</div>
                <div className="text-gray-300">24h Volume</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-orange-400 mb-2">100K+</div>
                <div className="text-gray-300">Roars</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 border-t border-white/20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/LOGO.png" alt="ChiliRoar" className="w-8 h-8 mr-2" />
              <span className="text-white font-semibold">ChiliRoar</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Test d'Authentification */}
      <div className="fixed bottom-4 right-4 z-50">
        <AuthTest />
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
    </div>
  );
} 