import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: 'blue' | 'emerald' | 'amber' | 'rose'
}

const colorMap = {
  blue: 'bg-linear-to-br from-blue-500/20 to-blue-600/5 text-blue-300',
  emerald: 'bg-linear-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-300',
  amber: 'bg-linear-to-br from-amber-500/20 to-amber-600/5 text-amber-300',
  rose: 'bg-linear-to-br from-rose-500/20 to-rose-600/5 text-rose-300',
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex items-center gap-4 transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-blue-200/60 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
