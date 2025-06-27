import React from 'react';
import { fanTokens, getTopFanTokens, getTotalMarketCap } from '../app/fanTokens';

export default function FanTokenStats() {
  const topTokens = getTopFanTokens(3);
  const totalMarketCap = getTotalMarketCap();
  const footballTokens = fanTokens.filter(token => token.category === 'football').length;
  const esportsTokens = fanTokens.filter(token => token.category === 'esports').length;
  const f1Tokens = fanTokens.filter(token => token.category === 'f1').length;

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <img src="/trophy.png" alt="Trophy" className="w-6 h-6 mr-2" />
        FanTokens Overview
      </h2>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{fanTokens.length}</div>
          <div className="text-sm text-gray-400">Total FanTokens</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">${totalMarketCap.toFixed(2)} M$</div>
          <div className="text-sm text-gray-400">Market Cap</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{footballTokens}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center">
            <img src="/trophy.png" alt="Football" className="w-4 h-4 mr-1" />
            Football
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{esportsTokens + f1Tokens}</div>
          <div className="text-sm text-gray-400 flex items-center justify-center">
            <img src="/arena.png" alt="Esports" className="w-4 h-4 mr-1" />
            Esports & F1
          </div>
        </div>
      </div>

      {/* Top 3 FanTokens */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <img src="/flame.png" alt="Top" className="w-5 h-5 mr-2" />
          Top 3 FanTokens
        </h3>
        <div className="space-y-3">
          {topTokens.map((token, index) => {
            const isOG = token.ticker === 'OG';
            const isASR = token.ticker === 'ASR';
            const isPSG = token.ticker === 'PSG';
            return (
              <div 
                key={token.id} 
                className={`flex items-center justify-between rounded-lg p-3 ${
                  isOG 
                    ? 'bg-gradient-to-r from-purple-900/80 to-blue-900/80 relative overflow-hidden' 
                    : isASR
                    ? 'bg-gradient-to-r from-red-900/80 to-blue-900/80 relative overflow-hidden'
                    : isPSG
                    ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 relative overflow-hidden'
                    : 'bg-gray-800'
                }`}
                style={isOG ? {
                  backgroundImage: 'url(/OG.png)',
                  backgroundSize: '100% 300%',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                } : isASR ? {
                  backgroundImage: 'url(/ASR.png)',
                  backgroundSize: '100% 300%',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                } : isPSG ? {
                  backgroundImage: 'url(/PSG.png)',
                  backgroundSize: '100% 300%',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay'
                } : {}}
              >
                {isOG && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-900/60"></div>
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex items-center">
                    <img 
                      src={index === 0 ? '/gold.png' : index === 1 ? '/silver.png' : '/bronze.png'} 
                      alt={`Rank ${index + 1}`}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{token.ticker}</div>
                    <div className="text-sm text-gray-300">{token.name}</div>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <div className="font-bold text-white">${token.price.toFixed(4)}</div>
                  <div className="text-xs text-gray-300">{token.category}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
            Voir tous les FanTokens
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
            Échanger
          </button>
        </div>
      </div>
    </div>
  );
} 