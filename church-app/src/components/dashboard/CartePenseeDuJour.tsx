'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookOpen, X } from 'lucide-react'
import type { PenseeDuJour } from '@/types'

export default function CartePenseeDuJour({ pensee }: { pensee: PenseeDuJour }) {
  const [estOuverte, setEstOuverte] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setEstOuverte(true)}
        className="relative rounded-2xl border border-blue-400/20 overflow-hidden aspect-16/7 sm:aspect-16/5 text-left w-full group cursor-zoom-in"
      >
        <Image
          src={pensee.image_url}
          alt="Pensée du jour"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <p className="text-[11px] font-medium text-blue-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <BookOpen size={13} />
            Pensée du jour
          </p>
          {pensee.reference_biblique && (
            <p className="font-display text-base sm:text-lg font-semibold text-white drop-shadow">
              {pensee.reference_biblique}
            </p>
          )}
        </div>
      </button>

      {estOuverte && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setEstOuverte(false)}
        >
          <button
            type="button"
            onClick={() => setEstOuverte(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>

          <div
            className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[70vh] aspect-square sm:aspect-video">
              <Image src={pensee.image_url} alt="Pensée du jour" fill className="object-contain" />
            </div>
            {pensee.reference_biblique && (
              <div className="p-5 border-t border-white/10">
                <p className="text-[11px] font-medium text-blue-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <BookOpen size={13} />
                  Pensée du jour
                </p>
                <p className="font-display text-lg font-semibold text-white">{pensee.reference_biblique}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
