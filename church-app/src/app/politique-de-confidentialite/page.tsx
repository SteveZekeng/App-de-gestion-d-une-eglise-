export const metadata = {
  title: 'Politique de confidentialité — Centre International des Vainqueurs',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-blue-200/50 text-sm mb-10">Dernière mise à jour : 11 juillet 2026</p>

      <section className="flex flex-col gap-8 text-blue-100/80 leading-relaxed">

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">1. Qui sommes-nous ?</h2>
          <p>
            Le Centre International des Vainqueurs (CIV) est une communauté chrétienne. Notre application
            web, accessible à l&apos;adresse <span className="text-blue-300">https://church-app-teal.vercel.app</span>,
            permet à nos membres de suivre les sessions de prière en direct, de consulter les vidéos,
            de soumettre des intentions de prière et de rester connectés à la vie de l&apos;église.
          </p>
          <p className="mt-2">
            Responsable du traitement : Centre International des Vainqueurs<br />
            Contact : <span className="text-blue-300">stevezekeng@gmail.com</span>
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">2. Données collectées</h2>
          <p>Nous collectons uniquement les données nécessaires au fonctionnement de l&apos;application :</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li><strong className="text-white">Nom et prénom</strong> — pour personnaliser votre expérience</li>
            <li><strong className="text-white">Adresse email</strong> — pour l&apos;authentification et les communications</li>
            <li><strong className="text-white">Photo de profil</strong> — uniquement si vous vous connectez via Google ou Facebook (fournie par le réseau social)</li>
            <li><strong className="text-white">Intentions de prière</strong> — textes soumis volontairement dans l&apos;application</li>
            <li><strong className="text-white">Commentaires et likes</strong> — interactions lors des sessions de prière en direct</li>
          </ul>
          <p className="mt-2">
            Nous ne collectons pas de données bancaires, de numéros de téléphone, ni de données
            de localisation.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">3. Comment utilisons-nous vos données ?</h2>
          <ul className="list-disc list-inside flex flex-col gap-1">
            <li>Vous permettre de vous connecter et d&apos;accéder à l&apos;application</li>
            <li>Afficher votre nom lors des interactions communautaires (commentaires, likes)</li>
            <li>Vous envoyer des emails de réinitialisation de mot de passe si vous en faites la demande</li>
            <li>Permettre aux administrateurs de gérer les comptes membres</li>
          </ul>
          <p className="mt-2">
            Vos données ne sont <strong className="text-white">jamais vendues</strong> ni
            utilisées à des fins commerciales ou publicitaires.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">4. Connexion via réseaux sociaux</h2>
          <p>
            Si vous choisissez de vous connecter via <strong className="text-white">Google</strong> ou{' '}
            <strong className="text-white">Facebook</strong>, nous recevons uniquement votre nom,
            prénom et adresse email fournis par ces services. Nous n&apos;accédons pas à vos
            contacts, publications, messages privés ou toute autre donnée de votre compte social.
          </p>
          <p className="mt-2">
            La gestion de vos données par Google est régie par la{' '}
            <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              politique de confidentialité de Google
            </a>.
            Celle de Facebook est régie par la{' '}
            <a href="https://www.facebook.com/privacy/policy/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              politique de confidentialité de Meta
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">5. Partage des données</h2>
          <p>
            Vos données sont hébergées sur <strong className="text-white">Supabase</strong> (infrastructure
            sécurisée conforme aux normes RGPD, serveurs en Europe) et sur{' '}
            <strong className="text-white">Vercel</strong> pour l&apos;hébergement de l&apos;application.
            Aucune autre entité tierce n&apos;a accès à vos données personnelles.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">6. Conservation des données</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. Si vous demandez la
            suppression de votre compte, toutes vos données personnelles sont définitivement
            effacées dans un délai de 30 jours.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">7. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li><strong className="text-white">Accès</strong> — consulter les données que nous détenons sur vous</li>
            <li><strong className="text-white">Rectification</strong> — corriger vos informations personnelles</li>
            <li><strong className="text-white">Suppression</strong> — demander la suppression de votre compte et de vos données</li>
            <li><strong className="text-white">Opposition</strong> — vous opposer à certains traitements</li>
            <li><strong className="text-white">Portabilité</strong> — recevoir vos données dans un format lisible</li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous à :{' '}
            <span className="text-blue-300">stevezekeng@gmail.com</span>
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">8. Cookies</h2>
          <p>
            L&apos;application utilise uniquement des cookies de session nécessaires à votre
            authentification. Aucun cookie publicitaire ou de tracking n&apos;est utilisé.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">9. Modifications</h2>
          <p>
            Nous nous réservons le droit de mettre à jour cette politique à tout moment.
            La date de dernière mise à jour est indiquée en haut de cette page.
            Les modifications importantes vous seront notifiées par email.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-2">10. Contact</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité :<br />
            <span className="text-blue-300">stevezekeng@gmail.com</span>
          </p>
        </div>

      </section>

      <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-blue-200/30">
        © {new Date().getFullYear()} Centre International des Vainqueurs — Tous droits réservés
      </div>
    </main>
  )
}
