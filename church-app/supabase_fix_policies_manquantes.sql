-- ============================================
-- prieres : aucune policy DELETE n'existait -> suppression toujours
-- silencieusement bloquée par RLS pour admin/pasteur.
-- ============================================
create policy "prieres_delete_pasteur"
on public.prieres for delete
to public
using ( public.est_admin_ou_pasteur() );

-- ============================================
-- intentions : seul le propriétaire pouvait modifier sa propre intention
-- (intentions_update_own). Or CarteIntention.tsx fait passer le statut à
-- "traitee" depuis le compte du pasteur/admin qui répond, pas du fidèle.
-- ============================================
create policy "intentions_update_pasteur"
on public.intentions for update
to public
using ( public.est_admin_ou_pasteur() );
