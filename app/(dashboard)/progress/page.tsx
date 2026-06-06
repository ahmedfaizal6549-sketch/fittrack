import { createServerClient } from '@/lib/supabase/server'
import { WeightChart } from '@/components/progress/weight-chart'
import { WorkoutCalendar } from '@/components/progress/workout-calendar'
import { WeightLogger } from '@/components/progress/weight-logger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const fromDate = thirtyDaysAgo.toISOString().split('T')[0]

  const [weightRes, sessionsRes] = await Promise.all([
    supabase.from('weight_entries').select('weight_kg, logged_at').eq('user_id', user.id).gte('logged_at', fromDate).order('logged_at'),
    supabase.from('workout_sessions').select('logged_at, ended_at').eq('user_id', user.id).gte('logged_at', fromDate).order('logged_at'),
  ])

  const weights = weightRes.data ?? []
  const sessions = sessionsRes.data ?? []

  const first = weights[0]?.weight_kg
  const last = weights[weights.length - 1]?.weight_kg
  const diff = first && last ? (last - first) : null

  const completedSessions = sessions.filter(s => s.ended_at).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your weight and workout history (last 30 days)</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="font-mono text-xl font-bold">{last ? `${last}kg` : '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">Current weight</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            {diff !== null ? (
              <>
                <p className={`font-mono text-xl font-bold flex items-center justify-center gap-1 ${diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {diff < 0 ? <TrendingDown className="w-4 h-4" /> : diff > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  {Math.abs(diff).toFixed(1)}kg
                </p>
                <p className="text-xs text-muted-foreground mt-1">{diff < 0 ? 'Lost' : diff > 0 ? 'Gained' : 'No change'}</p>
              </>
            ) : (
              <><p className="font-mono text-xl font-bold text-muted-foreground">—</p><p className="text-xs text-muted-foreground mt-1">Change</p></>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="font-mono text-xl font-bold text-primary">{completedSessions}</p>
            <p className="text-xs text-muted-foreground mt-1">Workouts done</p>
          </CardContent>
        </Card>
      </div>

      {/* Weight logger */}
      <WeightLogger currentWeight={last} />

      {/* Weight chart */}
      {weights.length > 1 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weight Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart data={weights.map(w => ({ date: w.logged_at, weight: Number(w.weight_kg) }))} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Log your weight daily to see a chart here
          </CardContent>
        </Card>
      )}

      {/* Workout calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workout Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutCalendar sessionDates={sessions.map(s => s.logged_at)} />
        </CardContent>
      </Card>
    </div>
  )
}
