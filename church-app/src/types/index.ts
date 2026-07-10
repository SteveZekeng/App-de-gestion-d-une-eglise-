export type UserRole = 'fidele' | 'pasteur' | 'admin'

export interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  role: UserRole
  est_actif: boolean
  date_creation: string
}

export type PriereType = 'live' | 'rediffusion'
export type PriereStatut = 'planifie' | 'en_cours' | 'termine'

export interface Priere {
  id: string
  titre: string
  description: string | null
  type: PriereType
  url_video: string | null
  date_debut: string | null
  date_fin: string | null
  statut: PriereStatut
  createur_id: string
  date_creation: string
}

export interface Participation {
  id: string
  user_id: string
  priere_id: string
  date_participation: string
  duree_visionnage_sec: number
  position_reprise_sec: number
}

export type IntentionStatut = 'en_attente' | 'en_cours' | 'traitee'

export interface Intention {
  id: string
  user_id: string
  sujet: string
  description: string | null
  statut: IntentionStatut
  est_privee: boolean
  date_creation: string
}

export interface ReponseIntention {
  id: string
  intention_id: string
  responsable_id: string
  commentaire: string
  date_reponse: string
}

export interface VideoMotivation {
  id: string
  titre: string
  description: string | null
  url_video: string
  createur_id: string
  date_creation: string
}

export interface PenseeDuJour {
  id: string
  image_url: string
  reference_biblique: string | null
  createur_id: string
  date_creation: string
}

export interface LiveCommentaire {
  id: string
  priere_id: string
  user_id: string
  nom_auteur: string
  prenom_auteur: string
  contenu: string
  date_creation: string
}

export interface LiveLike {
  id: string
  priere_id: string
  user_id: string
  date_creation: string
}

export type NotificationType = 'info' | 'live' | 'intention' | 'rappel'

export interface Notification {
  id: string
  user_id: string
  titre: string
  message: string
  type: NotificationType
  est_lue: boolean
  date_envoi: string
  date_lecture: string | null
}