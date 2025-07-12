"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function AuthCodeError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');

  const handleRetry = () => {
    router.push('/');
  };

  const getErrorMessage = () => {
    if (errorDescription?.includes('user email')) {
      return {
        title: 'Problème d\'email avec Twitter',
        message: 'Twitter n\'a pas fourni votre adresse email. Vous pouvez continuer sans email ou essayer une autre méthode de connexion.',
        canContinue: true
      };
    }
    
    return {
      title: 'Erreur d\'authentification',
      message: errorDescription || 'Une erreur inattendue s\'est produite lors de la connexion.',
      canContinue: false
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
            <h2 className="text-2xl font-bold text-white">ChiliRoar</h2>
          </div>
          <div className="text-red-400 font-medium mb-2">
            ⚠️ {errorInfo.title}
          </div>
        </div>

        {/* Error Details */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm mb-4">
            {errorInfo.message}
          </p>
          
          {error && (
            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>Erreur:</strong> {error}</div>
              {errorCode && <div><strong>Code:</strong> {errorCode}</div>}
            </div>
          )}
        </div>

        {/* Solutions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-blue-400 font-semibold mb-2">💡 Solutions</h3>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Essayez de vous reconnecter avec Twitter</li>
            <li>• Utilisez la connexion avec wallet</li>
            <li>• Vérifiez vos paramètres de confidentialité Twitter</li>
            {errorInfo.canContinue && (
              <li>• Continuez sans email (vous pourrez l'ajouter plus tard)</li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Réessayer la connexion
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Retour à l'accueil
          </button>
        </div>

        {/* Help */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Besoin d'aide ? Contactez le support à{' '}
            <a href="mailto:support@chiliroar.com" className="text-green-400 hover:text-green-300">
              support@chiliroar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 