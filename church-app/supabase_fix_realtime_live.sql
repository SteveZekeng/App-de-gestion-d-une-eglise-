-- Supabase n'active pas le Realtime automatiquement sur une nouvelle table :
-- il faut l'ajouter explicitement à la publication `supabase_realtime`, sinon
-- les écouteurs postgres_changes (commentaires/likes en direct) ne reçoivent
-- jamais d'événement — seule la lecture initiale (au chargement de la page)
-- fonctionne, donnant l'impression que "ça ne se met pas à jour en direct".
alter publication supabase_realtime add table public.live_commentaires;
alter publication supabase_realtime add table public.live_likes;
