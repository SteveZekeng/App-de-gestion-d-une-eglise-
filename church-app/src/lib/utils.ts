import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function estUrlYoutube(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url)
}

//Cette fonction cn() sera utilisée dans tous tes composants 
// pour gérer les classes Tailwind proprement.