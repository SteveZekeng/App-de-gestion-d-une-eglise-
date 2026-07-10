-- participations n'avait qu'une policy ALL scopée à auth.uid() = user_id :
-- un admin/pasteur qui consulte la vue d'ensemble ne voyait donc que ses
-- propres participations, faussant silencieusement toutes les statistiques
-- agrégées (participations totales, % de fidèles engagés, participants au
-- live en cours). Policy additive : ne change rien à la gestion par chacun
-- de ses propres participations.
create policy "participations_select_admin"
on public.participations for select
to public
using ( public.est_admin_ou_pasteur() );
