import { createServerClient } from '@/lib/supabase/server'
import { WorkoutPlans } from '@/components/workout/workout-plans'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default async function WorkoutPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]

  const [plansRes, recentSessionsRes, todaySessionRes] = await Promise.all([
    supabase
      .from('workout_plans')
      .select(`*, plan_days(*, plan_exercises(*))`)
      .eq('user_id', user.id)
      .order('created_at'),
    supabase
      .from('workout_sessions')
      .select('*, plan_days(day_label)')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(5),
    supabase
      .from('workout_sessions')
      .select('id, ended_at, plan_day_id')
      .eq('user_id', user.id)
      .eq('logged_at', today)
      .maybeSingle(),
  ])

  const plans = plansRes.data ?? []
  const recentSessions = recentSessionsRes.data ?? []
  const todaySession = todaySessionRes.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workout</h1>
        <p className="text-sm text-muted-foreground mt-1">Your beginner 3-day full-body plan</p>
      </div>

      {/* Today's status */}
      {todaySession && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Workout logged today!</p>
              {!todaySession.ended_at && (
                <Link href="/workout/log" className="text-xs text-green-600 underline">Continue session →</Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan cards */}
      <WorkoutPlans plans={plans} todaySessionPlanDayId={todaySession?.plan_day_id ?? null} />

      {/* Recent history */}
      {recentSessions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Sessions</h2>
          <div className="space-y-2">
            {recentSessions.map((s: any) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{s.plan_days?.day_label ?? 'Free Session'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.logged_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <Badge variant={s.ended_at ? 'secondary' : 'outline'} className="text-xs">
                    {s.ended_at ? 'Completed' : 'In progress'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
