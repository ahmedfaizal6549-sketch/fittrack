import { createServerClient } from '@/lib/supabase/server'
import { WaterTracker } from '@/components/water/water-tracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets } from 'lucide-react'

export default async function WaterPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]

  const [entriesRes, profileRes] = await Promise.all([
    supabase.from('water_entries').select('*').eq('user_id', user.id).eq('logged_at', today).order('logged_time'),
    supabase.from('user_profiles').select('water_goal_ml').eq('id', user.id).maybeSingle(),
  ])

  const entries = entriesRes.data ?? []
  const goal = profileRes.data?.water_goal_ml ?? 2000
  const total = entries.reduce((sum, e) => sum + e.amount_ml, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Water Intake</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay hydrated — goal: {goal / 1000}L per day</p>
      </div>

      <WaterTracker entries={entries} total={total} goal={goal} />

      {/* Log history */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Today&apos;s log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">
                  {new Date(e.logged_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-medium">{e.amount_ml} ml</span>
              </div>
            ))}
            <p className="text-right text-sm font-bold text-blue-600 pt-1">{total} ml / {goal} ml</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
