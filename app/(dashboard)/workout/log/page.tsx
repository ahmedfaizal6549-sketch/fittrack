import { createServerClient } from '@/lib/supabase/server'
import { WorkoutSession } from '@/components/workout/workout-session'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ sessionId?: string; planDayId?: string }>
}

export default async function WorkoutLogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { sessionId, planDayId } = params

  if (!sessionId) redirect('/workout')

  const supabase = await createServerClient()

  const [sessionRes, exercisesRes, setsRes] = await Promise.all([
    supabase.from('workout_sessions').select('*').eq('id', sessionId).single(),
    planDayId
      ? supabase.from('plan_exercises').select('*').eq('plan_day_id', planDayId).order('order_index')
      : Promise.resolve({ data: [] }),
    supabase.from('workout_sets').select('*').eq('session_id', sessionId).order('created_at'),
  ])

  if (!sessionRes.data) redirect('/workout')

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Workout Session</h1>
        <p className="text-sm text-muted-foreground">Log your sets and reps</p>
      </div>
      <WorkoutSession
        sessionId={sessionId}
        exercises={exercisesRes.data ?? []}
        loggedSets={setsRes.data ?? []}
      />
    </div>
  )
}
