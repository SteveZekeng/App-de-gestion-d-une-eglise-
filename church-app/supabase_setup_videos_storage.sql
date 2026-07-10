-- ============================================
-- Storage : bucket public pour les vidéos importées
-- (culte, veillée, camp... importés depuis téléphone/ordinateur)
-- ============================================
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "videos_storage_lecture_publique"
on storage.objects for select
using ( bucket_id = 'videos' );

create policy "videos_storage_upload_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'videos'
  and public.est_admin_ou_pasteur()
);
