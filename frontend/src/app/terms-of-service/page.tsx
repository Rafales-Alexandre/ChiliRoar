import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-16 h-16 mr-4" />
            <h1 className="text-4xl font-bold text-white">ChiliRoar</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-300">Conditions d'Utilisation</h2>
          <p className="text-gray-400 mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-2xl p-8 space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">1. Acceptation des Conditions</h3>
            <p className="text-gray-300 leading-relaxed">
              En utilisant ChiliRoar, vous acceptez ces conditions d'utilisation dans leur intégralité. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">2. Description du Service</h3>
            <p className="text-gray-300 leading-relaxed">
              ChiliRoar est une plateforme de récompenses pour les fans de sport qui permet :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>La participation à des campagnes de récompenses</li>
              <li>La gestion de tokens fan et de portefeuilles crypto</li>
              <li>L'interaction avec des communautés sportives</li>
              <li>L'accès à des fonctionnalités de gamification</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">3. Éligibilité</h3>
            <p className="text-gray-300 leading-relaxed">
              Pour utiliser ChiliRoar, vous devez :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Être âgé d'au moins 18 ans</li>
              <li>Avoir la capacité légale de conclure des contrats</li>
              <li>Fournir des informations exactes et complètes</li>
              <li>Respecter les lois applicables dans votre juridiction</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">4. Utilisation Acceptable</h3>
            <p className="text-gray-300 leading-relaxed">
              Vous vous engagez à ne pas :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Utiliser le service à des fins illégales ou non autorisées</li>
              <li>Tenter de contourner les mesures de sécurité</li>
              <li>Créer de faux comptes ou usurper l'identité d'autrui</li>
              <li>Spammer ou harceler d'autres utilisateurs</li>
              <li>Violer les droits de propriété intellectuelle</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">5. Tokens et Récompenses</h3>
            <p className="text-gray-300 leading-relaxed">
              Les tokens et récompenses distribués via ChiliRoar :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>N'ont aucune valeur monétaire garantie</li>
              <li>Peuvent être modifiés ou supprimés à notre discrétion</li>
              <li>Sont soumis aux conditions des émetteurs de tokens</li>
              <li>Peuvent être révoqués en cas de violation des conditions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">6. Propriété Intellectuelle</h3>
            <p className="text-gray-300 leading-relaxed">
              ChiliRoar et ses logos, marques, et contenus sont protégés par les droits de propriété intellectuelle. 
              Vous ne pouvez pas utiliser nos marques sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">7. Limitation de Responsabilité</h3>
            <p className="text-gray-300 leading-relaxed">
              ChiliRoar est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas responsables :
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Des pertes financières liées aux tokens ou crypto-monnaies</li>
              <li>Des interruptions de service ou bugs</li>
              <li>Des actions de tiers ou des violations de sécurité</li>
              <li>Des décisions prises sur la base de nos informations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">8. Résiliation</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous pouvons suspendre ou résilier votre accès à tout moment, avec ou sans préavis, 
              en cas de violation de ces conditions ou pour toute autre raison légitime.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">9. Modifications</h3>
            <p className="text-gray-300 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les modifications prendront effet dès leur publication sur cette page.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">10. Contact</h3>
            <p className="text-gray-300 leading-relaxed">
              Pour toute question concernant ces conditions d'utilisation, contactez-nous à :
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