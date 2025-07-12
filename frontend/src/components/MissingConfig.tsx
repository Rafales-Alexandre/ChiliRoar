"use client";
import React from 'react';

export default function MissingConfig() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
            <h2 className="text-2xl font-bold text-white">ChiliRoar</h2>
          </div>
          <div className="text-red-400 font-medium mb-4">
            ⚠️ Configuration manquante
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Configuration requise</h3>
          <p className="text-gray-300 text-sm mb-4">
            Pour utiliser ChiliRoar, vous devez configurer Supabase :
          </p>
          
          <ol className="text-gray-300 text-sm space-y-2 mb-4">
            <li>1. Créez un projet sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">supabase.com</a></li>
            <li>2. Créez un fichier <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> à la racine</li>
            <li>3. Ajoutez vos clés Supabase dans ce fichier</li>
          </ol>

          <div className="bg-gray-700 rounded p-3 mb-4">
            <p className="text-gray-300 text-xs font-mono">
              NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
            </p>
          </div>

          <div className="text-center">
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 inline-block"
            >
              Créer un projet Supabase
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Besoin d'aide ? Consultez{' '}
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
              GETTING_STARTED.md
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 