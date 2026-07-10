import { LucideIcon } from 'lucide-react'

interface BarListItem {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

export default function BarList({ titre, items }: { titre: string; items: BarListItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-white">{titre}</p>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon
          const largeur = Math.max(4, Math.round((item.value / max) * 100))
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-36 shrink-0 text-xs text-blue-200/70">
                <Icon size={13} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${largeur}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-sm font-semibold text-white w-8 text-right shrink-0">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
