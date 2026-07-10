import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Panneau gauche — identité de l'église */}
      <div className="relative hidden overflow-hidden bg-black lg:flex lg:flex-col lg:p-12">
        <div
          className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-700/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logoChurch.png" alt="CIV" width={40} height={40} />
          <span className="font-display text-sm tracking-widest text-blue-100/80 uppercase">
            Centre International des Vainqueurs
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-display text-sm tracking-widest text-blue-300/70 uppercase">
            Bienvenue au
          </p>
          <h1 className="font-display mt-2 text-3xl leading-tight font-semibold text-white">
            CENTRE INTERNATIONAL
            <br />
            DES VAINQUEURS
          </h1>
          <p className="mt-4 max-w-sm text-sm text-blue-200/70">
            Vainqueurs par le sang, Conquête par la parole, Destinée par la gloire !
          </p>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Image
              src="/logoChurch.png"
              alt="Centre International des Vainqueurs"
              width={64}
              height={64}
              className="mx-auto mb-4"
              priority
            />
            <h1 className="font-display text-lg font-semibold text-foreground">
              CENTRE INTERNATIONAL DES VAINQUEURS
            </h1>
            <p className="mt-1 text-xs text-blue-700/70 dark:text-blue-200/70">
              Vainqueurs par le sang, Conquête par la parole, Destinée par la gloire !
            </p>
          </div>

          <div className="rounded-2xl border border-blue-900/12 dark:border-white/10 bg-blue-900/4 dark:bg-white/3 p-8 shadow-xl shadow-blue-900/5 dark:shadow-black/40 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
