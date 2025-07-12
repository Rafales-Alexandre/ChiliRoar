import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-16 h-16 mr-4" />
            <h1 className="text-4xl font-bold text-white">ChiliRoar</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-300">Politique de Confidentialité</h2>
          <p className="text-gray-400 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-2xl p-8 space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">1. Collecte des Données</h3>
            <p className="text-gray-300 leading-relaxed">
              ChiliRoar collecte uniquement les informations nécessaires au fonctionnement de l'application :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Nom d'utilisateur et informations de profil public des réseaux sociaux</li>
              <li>Adresse de portefeuille crypto (optionnel)</li>
              <li>Données d'utilisation anonymisées pour améliorer l'expérience</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">2. Utilisation des Données</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Calculer et attribuer des récompenses</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">3. Partage des Données</h3>
            <p className="text-gray-300 leading-relaxed">
              ChiliRoar ne partage jamais vos données personnelles avec des tiers à des fins commerciales. 
              Nous pouvons partager des données anonymisées à des fins d'analyse et d'amélioration.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">4. Sécurité</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous utilisons des mesures de sécurité standard de l'industrie pour protéger vos données, 
              incluant le chiffrement et l'authentification sécurisée.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">5. Vos Droits</h3>
            <p className="text-gray-300 leading-relaxed">
              Vous avez le droit de :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger ou supprimer vos données</li>
              <li>Retirer votre consentement à tout moment</li>
              <li>Exporter vos données</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">6. Cookies et Tracking</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous utilisons des cookies essentiels pour le fonctionnement de l'application. 
              Aucun cookie de tracking tiers n'est utilisé sans votre consentement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">7. Contact</h3>
            <p className="text-gray-300 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité, contactez-nous à :
            </p>
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <p className="text-green-400 font-medium">support@chiliroar.com</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
} 