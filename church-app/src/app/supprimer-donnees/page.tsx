export const metadata = {
  title: 'Suppression des données — Centre International des Vainqueurs',
}

export default function SupprimerDonneesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Suppression des données utilisateur</h1>
      <p className="text-blue-200/50 text-sm mb-10">Centre International des Vainqueurs</p>

      <section className="flex flex-col gap-6 text-blue-100/80 leading-relaxed">

        <p>
          Conformément aux exigences de la plateforme Facebook et au Règlement Général sur la
          Protection des Données (RGPD), vous pouvez demander la suppression de toutes vos
          données personnelles de notre application.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-lg">Option 1 — Supprimer votre compte depuis l&apos;app</h2>
          <p>
            Si vous êtes connecté à l&apos;application, un administrateur peut supprimer votre compte
            directement depuis l&apos;espace de gestion. Toutes vos données (profil, intentions de
            prière, commentaires, likes) seront définitivement effacées.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-lg">Option 2 — Envoyer une demande par email</h2>
          <p>
            Envoyez un email à{' '}
            <a href="mailto:stevezekeng@gmail.com" className="text-blue-400 hover:underline font-medium">
              stevezekeng@gmail.com
            </a>{' '}
            avec pour objet <strong className="text-white">"Suppression de mes données"</strong> en
            précisant l&apos;adresse email associée à votre compte.
          </p>
          <p>
            Nous traiterons votre demande dans un délai de <strong className="text-white">30 jours</strong> et
            vous enverrons une confirmation une fois vos données supprimées.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm text-blue-200/70">
            <strong className="text-white">Données supprimées :</strong> nom, prénom, email, intentions de
            prière, commentaires, likes, et toute information liée à votre compte. La suppression
            est <strong className="text-white">définitive et irréversible</strong>.
          </p>
        </div>

      </section>

      <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-blue-200/30">
        © {new Date().getFullYear()} Centre International des Vainqueurs —{' '}
        <a href="/politique-de-confidentialite" className="hover:text-blue-200/60 transition-colors">
          Politique de confidentialité
        </a>
      </div>
    </main>
  )
}
