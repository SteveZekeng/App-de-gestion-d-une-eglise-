export type Locale = 'fr' | 'en'

export const translations: Record<Locale, Record<string, string>> = {
  fr: {
    nav_dashboard: 'Tableau de bord',
    nav_prieres: 'Prières',
    nav_videos: 'Vidéothèque',
    nav_intentions: 'Intentions',
    nav_admin: 'Admin',
    nav_parametres: 'Paramètres',
    deconnexion: 'Déconnexion',

    admin_vue_ensemble: 'Vue d’ensemble',
    admin_predications: 'Prédications/Posts',
    admin_pensee: 'Pensée du jour',
    admin_utilisateurs: 'Utilisateurs',

    parametres_titre: 'Paramètres',
    parametres_sous_titre: 'Personnalisez votre expérience',
    langue: 'Langue',
    langue_francais: 'Français',
    langue_anglais: 'Anglais',
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_prieres: 'Prayers',
    nav_videos: 'Video library',
    nav_intentions: 'Intentions',
    nav_admin: 'Admin',
    nav_parametres: 'Settings',
    deconnexion: 'Log out',

    admin_vue_ensemble: 'Overview',
    admin_predications: 'Sermons/Posts',
    admin_pensee: 'Thought of the day',
    admin_utilisateurs: 'Users',

    parametres_titre: 'Settings',
    parametres_sous_titre: 'Customize your experience',
    langue: 'Language',
    langue_francais: 'French',
    langue_anglais: 'English',
  },
}
