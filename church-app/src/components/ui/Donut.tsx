interface DonutProps {
  label: string
  value: number
  total: number
  color?: string
  sousTexte?: string
}

export default function Donut({ label, value, total, color = '#3b82f6', sousTexte }: DonutProps) {
  const pourcentage = total > 0 ? Math.round((value / total) * 100) : 0
  const rayon = 34
  const circonference = 2 * Math.PI * rayon
  const decoupe = circonference * (1 - pourcentage / 100)

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex items-center gap-4 transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r={rayon} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r={rayon}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circonference}
            strokeDashoffset={decoupe}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{pourcentage}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-blue-200/60 mt-0.5">
          {value} / {total}
        </p>
        {sousTexte && <p className="text-[11px] text-blue-200/40 mt-1">{sousTexte}</p>}
      </div>
    </div>
  )
}
