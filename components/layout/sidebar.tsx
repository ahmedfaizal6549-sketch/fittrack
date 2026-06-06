'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Droplets, TrendingUp, LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/diet', label: 'Diet', icon: UtensilsCrossed },
  { href: '/water', label: 'Water', icon: Droplets },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-card border-r border-border py-6 px-3 gap-1 fixed left-0 top-0 bottom-0 z-30">
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
          <Dumbbell className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">FitTrack</span>
      </div>
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
      <form action={signOut}>
        <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </form>
    </aside>
  )
}
