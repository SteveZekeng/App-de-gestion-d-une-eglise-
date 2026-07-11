# Documentation Backend — CIV

## Architecture

Le backend est entièrement géré par **Supabase** (BaaS). Il n'y a pas de serveur Node.js dédié. Les opérations sensibles passent par des **API Routes Next.js** qui utilisent la clé `service_role` côté serveur.

---

## Supabase

**URL :** `https://nmqctnkfqzqhdgaxneet.supabase.co`

### Tables principales

| Table | Description |
|-------|-------------|
| `utilisateurs` | Profils membres (id = auth.users.id, nom, prenom, email, role) |
| `videos` | Vidéos publiées (titre, url, description, thumbnail) |
| `pensees` | Pensées du jour (texte, image_url, date) |
| `intentions_priere` | Intentions soumises par les fidèles |
| `sessions_live` | Sessions de prière en direct (titre, youtube_url, actif) |
| `commentaires` | Commentaires pendant le live (session_id, user_id, contenu) |
| `likes` | Likes pendant le live (session_id, user_id) |

### Sécurité (RLS)

Row Level Security activé sur toutes les tables. Les règles permettent :
- Lecture publique selon les tables
- Écriture uniquement par l'utilisateur propriétaire ou les admins (via service_role)

### Storage

Bucket `videos` — stockage des fichiers vidéo uploadés par les admins.
Bucket `images` — stockage des images (pensées du jour, thumbnails).

### Realtime

Utilisé pour le live : présence des utilisateurs connectés, nouveaux commentaires et likes en temps réel via `supabase.channel()`.

---

## Authentification

Gérée par **Supabase Auth** avec le mode PKCE (`@supabase/ssr`).

### Flux email/password

1. `signUp` → email de confirmation envoyé
2. Clic sur le lien → `/auth/confirm?token_hash=...&type=email` → session créée
3. Redirect vers `/dashboard` ou `/admin` selon le rôle

### Flux mot de passe oublié

1. `resetPasswordForEmail` → email envoyé avec lien
2. Clic sur le lien → `/reinitialiser-mot-de-passe#access_token=...`
3. La page lit le hash avec `@supabase/supabase-js` (vanilla, hors PKCE) → `updateUser`

### Flux OAuth (Google / Facebook)

1. `signInWithOAuth({ provider })` → redirect vers Google/Facebook
2. Callback → `/auth/callback?code=...`
3. `exchangeCodeForSession(code)` → session créée
4. Si nouvel utilisateur : insert dans `utilisateurs` avec `role: 'fidele'`
5. Redirect vers `/dashboard` ou `/admin` selon le rôle

### Clients Supabase

| Fichier | Usage |
|---------|-------|
| `src/lib/supabase/client.ts` | Client navigateur (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | Client serveur avec cookies (`createServerClient`) |
| `src/lib/supabase/admin.ts` | Client admin avec `service_role` (API Routes uniquement) |

---

## API Routes

Toutes dans `src/app/api/`. Utilisent le client admin pour les opérations privilégiées.

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/admin/utilisateurs` | GET | Liste tous les membres |
| `/api/admin/utilisateurs/[id]` | DELETE | Supprime un membre (auth + profil) |
| `/api/admin/videos` | GET, POST | Liste / crée une vidéo |
| `/api/admin/videos/[id]` | PUT, DELETE | Modifie / supprime une vidéo |
| `/api/admin/pensees` | GET, POST | Liste / crée une pensée du jour |
| `/api/admin/live` | GET, POST | Gestion des sessions live |

### Sécurité des API Routes

Chaque route vérifie le rôle de l'utilisateur appelant avant d'agir :
- `admin` : accès complet
- `pasteur` : accès sauf suppression d'autres admins/pasteurs
- Autres : 403

---

## Middleware / Proxy

Fichier : `src/proxy.ts` (exporté comme `proxy`, pas `middleware` — spécificité Next.js v16+)

Protège toutes les routes `/dashboard` et `/admin`. Logique :
- Erreur réseau (pas de statut HTTP) → laisse passer (fail-open)
- Pas de session + route protégée → redirect `/login`
- Session valide → laisse passer

---

## Providers OAuth configurés

### Google
- Client ID configuré dans Google Cloud Console
- Callback URL : `https://nmqctnkfqzqhdgaxneet.supabase.co/auth/v1/callback`
- Activé dans Supabase → Authentication → Providers → Google

### Facebook
- App ID : `1547694990165763` (App "CIV" sur Meta Developer)
- Callback URL : `https://nmqctnkfqzqhdgaxneet.supabase.co/auth/v1/callback`
- Activé dans Supabase → Authentication → Providers → Facebook
- Pages requises par Meta : `/politique-de-confidentialite`, `/supprimer-donnees`

---

## Variables d'environnement

| Variable | Visibilité | Description |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Publique | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publique | Clé anonyme (lecture RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur uniquement | Clé admin — bypass RLS |

> **Important :** `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais apparaître côté client ni dans git.
