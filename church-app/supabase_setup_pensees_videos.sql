-- ============================================
-- Table : pensees_du_jour
-- ============================================
create table public.pensees_du_jour (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  reference_biblique text,
  createur_id uuid not null references public.utilisateurs(id),
  date_creation timestamptz not null default now()
);

alter table public.pensees_du_jour enable row level security;

create policy "pensees_select_all"
on public.pensees_du_jour for select
to authenticated
using ( true );

create policy "pensees_insert_admin"
on public.pensees_du_jour for insert
to authenticated
with check ( public.est_admin_ou_pasteur() );

create policy "pensees_update_admin"
on public.pensees_du_jour for update
to authenticated
using ( public.est_admin_ou_pasteur() );

create policy "pensees_delete_admin"
on public.pensees_du_jour for delete
to authenticated
using ( public.est_admin_ou_pasteur() );

-- ============================================
-- Table : videos_motivation
-- ============================================
create table public.videos_motivation (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  url_video text not null,
  createur_id uuid not null references public.utilisateurs(id),
  date_creation timestamptz not null default now()
);

alter table public.videos_motivation enable row level security;

create policy "videos_select_all"
on public.videos_motivation for select
to authenticated
using ( true );

create policy "videos_insert_admin"
on public.videos_motivation for insert
to authenticated
with check ( public.est_admin_ou_pasteur() );

create policy "videos_update_admin"
on public.videos_motivation for update
to authenticated
using ( public.est_admin_ou_pasteur() );

create policy "videos_delete_admin"
on public.videos_motivation for delete
to authenticated
using ( public.est_admin_ou_pasteur() );

-- ============================================
-- Storage : bucket public pour les images de pensée du jour
-- ============================================
insert into storage.buckets (id, name, public)
values ('pensees', 'pensees', true)
on conflict (id) do nothing;

create policy "pensees_storage_lecture_publique"
on storage.objects for select
using ( bucket_id = 'pensees' );

create policy "pensees_storage_upload_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'pensees'
  and public.est_admin_ou_pasteur()
);
