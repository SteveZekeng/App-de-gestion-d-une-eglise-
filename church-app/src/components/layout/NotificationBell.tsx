'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Check } from 'lucide-react'
import type { Notification } from '@/types'

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const nonLues = notifications.filter((n) => !n.est_lue).length

  useEffect(() => {
    const supabase = createClient()

    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('date_envoi', { ascending: false })
        .limit(20)
        .returns<Notification[]>()

      setNotifications(data ?? [])
    }

    fetchNotifications()

    // Écoute en temps réel les nouvelles notifications
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function marquerCommeLue(notifId: string) {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ est_lue: true, date_lecture: new Date().toISOString() })
      .eq('id', notifId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, est_lue: true } : n))
    )
  }

  async function toutMarquerLu() {
    const supabase = createClient()
    const idsNonLus = notifications.filter((n) => !n.est_lue).map((n) => n.id)
    if (idsNonLus.length === 0) return

    await supabase
      .from('notifications')
      .update({ est_lue: true, date_lecture: new Date().toISOString() })
      .in('id', idsNonLus)

    setNotifications((prev) => prev.map((n) => ({ ...n, est_lue: true })))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Bell size={19} className="text-blue-200/80" />
        {nonLues > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
            {nonLues > 9 ? '9+' : nonLues}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-30 max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-display text-sm font-semibold text-white">Notifications</span>
              {nonLues > 0 && (
                <button
                  onClick={toutMarquerLu}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <p className="text-sm text-blue-200/50 text-center py-8">Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-white/10 flex gap-2 ${
                      !notif.est_lue ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{notif.titre}</p>
                      <p className="text-xs text-blue-200/60 mt-0.5">{notif.message}</p>
                      <p className="text-[11px] text-blue-200/40 mt-1">
                        {new Date(notif.date_envoi).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    {!notif.est_lue && (
                      <button
                        onClick={() => marquerCommeLue(notif.id)}
                        className="text-blue-200/30 hover:text-blue-400 shrink-0"
                        title="Marquer comme lue"
                      >
                        <Check size={15} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}