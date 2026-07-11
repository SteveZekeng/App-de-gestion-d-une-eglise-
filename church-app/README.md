# Application CIV — Centre International des Vainqueurs

Application web de gestion communautaire pour une église chrétienne. Elle permet aux membres de suivre les sessions de prière en direct, consulter les vidéos, soumettre des intentions de prière et rester connectés à la vie de l'église.

**URL de production :** https://church-app-teal.vercel.app

---

## Stack technique

- **Frontend / Backend :** Next.js (App Router, Turbopack)
- **Base de données & Auth :** Supabase (Postgres + RLS + Storage + Realtime)
- **Hébergement :** Vercel (plan gratuit)
- **Auth sociale :** Google OAuth, Facebook Login

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `admin` | Accès complet — gestion membres, vidéos, pensées, live |
| `pasteur` | Même accès qu'admin sauf suppression d'autres admins/pasteurs |
| `fidele` | Dashboard membre — prière, vidéos, live |

## Structure des dossiers

```
src/
├── app/
│   ├── (auth)/          # Login, register, mot de passe oublié, réinitialisation
│   ├── (dashboard)/     # Dashboard fidèle
│   ├── admin/           # Espace administration
│   ├── auth/callback/   # Callback OAuth (Google, Facebook)
│   ├── politique-de-confidentialite/
│   └── supprimer-donnees/
├── components/
│   ├── admin/           # Formulaires admin (vidéo, pensée du jour, live...)
│   └── ui/              # Composants réutilisables (Button, Input, BoutonGoogle...)
└── lib/
    └── supabase/        # Clients Supabase (server, client, admin)
```

## Variables d'environnement

Copie `.env.local.example` en `.env.local` et remplis les valeurs :

```
NEXT_PUBLIC_SUPABASE_URL=         # URL de ton projet Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Clé anon (publique)
SUPABASE_SERVICE_ROLE_KEY=        # Clé service role (privée — ne jamais exposer)
```

Ces variables sont configurées sur Vercel via le dashboard ou la CLI.

## Lancer en local

```bash
npm install
npm run dev      # Démarre sur http://localhost:3001
```

## Déployer

Le déploiement est automatique via GitHub → Vercel à chaque push sur `master`.

Pour un déploiement manuel :

```bash
npx vercel --prod
```

## Pages publiques (sans authentification)

- `/login` — Connexion
- `/register` — Inscription
- `/mot-de-passe-oublie` — Réinitialisation mot de passe
- `/politique-de-confidentialite` — Politique RGPD
- `/supprimer-donnees` — Suppression des données (requis Facebook)
