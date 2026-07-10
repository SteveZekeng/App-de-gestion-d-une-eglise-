-- ============================================
-- Table : live_commentaires
-- Commentaires postés par les fidèles pendant (ou après) une session de prière.
-- ============================================
-- nom_auteur/prenom_auteur sont dénormalisés (capturés à la publication) car
-- les fidèles n'ont pas le droit de lire les lignes `utilisateurs` des autres
-- (RLS : chacun ne voit que la sienne) — éviter un join impossible plutôt que
-- relâcher la policy de la table utilisateurs pour ce seul besoin d'affichage.
create table public.live_commentaires (
  id uuid primary key default gen_random_uuid(),
  priere_id uuid not null references public.prieres(id) on delete cascade,
  user_id uuid not null references public.utilisateurs(id),
  nom_auteur text not null,
  prenom_auteur text not null,
  contenu text not null,
  date_creation timestamptz not null default now()
);

alter table public.live_commentaires enable row level security;

create policy "live_commentaires_select_all"
on public.live_commentaires for select
to authenticated
using ( true );

create policy "live_commentaires_insert_own"
on public.live_commentaires for insert
to authenticated
with check ( auth.uid() = user_id );

create policy "live_commentaires_delete_own_or_admin"
on public.live_commentaires for delete
to authenticated
using ( auth.uid() = user_id or public.est_admin_ou_pasteur() );

-- ============================================
-- Table : live_likes
-- Un like par fidèle et par session (toggle on/off).
-- ============================================
create table public.live_likes (
  id uuid primary key default gen_random_uuid(),
  priere_id uuid not null references public.prieres(id) on delete cascade,
  user_id uuid not null references public.utilisateurs(id),
  date_creation timestamptz not null default now(),
  unique (priere_id, user_id)
);

alter table public.live_likes enable row level security;

create policy "live_likes_select_all"
on public.live_likes for select
to authenticated
using ( true );

create policy "live_likes_insert_own"
on public.live_likes for insert
to authenticated
with check ( auth.uid() = user_id );

create policy "live_likes_delete_own"
on public.live_likes for delete
to authenticated
using ( auth.uid() = user_id );
