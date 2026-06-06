'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Droplets, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/diet', label: 'Diet', icon: UtensilsCrossed },
  { href: '/water', label: 'Water', icon: Droplets },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[56px]',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'fill-primary/20')} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
