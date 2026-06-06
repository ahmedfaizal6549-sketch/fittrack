'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { BEGINNER_PLAN } from '@/lib/data/starter-plans'

export async function seedWorkoutPlan() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if plan already exists with the current name — if not, wipe and re-seed
  const { data: existing } = await supabase
    .from('workout_plans')
    .select('id, name')
    .eq('user_id', user.id)
    .limit(1)

  if (existing && existing.length > 0) {
    if (existing[0].name === BEGINNER_PLAN.name) return existing[0].id
    // Plan name changed — delete old plan and re-seed
    await supabase.from('workout_plans').delete().eq('user_id', user.id)
  }

  const { data: plan } = await supabase
    .from('workout_plans')
    .insert({ user_id: user.id, name: BEGINNER_PLAN.name, description: BEGINNER_PLAN.description, is_active: true })
    .select('id')
    .single()

  if (!plan) return null

  for (const day of BEGINNER_PLAN.days) {
    const { data: planDay } = await supabase
      .from('plan_days')
      .insert({ plan_id: plan.id, day_label: day.dayLabel, day_order: day.dayOrder })
      .select('id')
      .single()

    if (!planDay) continue

    for (const ex of day.exercises) {
      await supabase.from('plan_exercises').insert({
        plan_day_id: planDay.id,
        exercise_name: ex.name,
        sets_target: ex.setsTarget,
        reps_target: ex.repsTarget,
        rest_seconds: ex.restSeconds,
        notes: ex.notes,
        order_index: ex.orderIndex,
      })
    }
  }

  return plan.id
}

export async function startWorkoutSession(planDayId: string | null) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      plan_day_id: planDayId,
      logged_at: today,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  revalidatePath('/workout')
  return data?.id
}

export async function logSet(sessionId: string, exerciseName: string, setNumber: number, reps: number, weightKg: number) {
  const supabase = await createServerClient()
  await supabase.from('workout_sets').insert({
    session_id: sessionId,
    exercise_name: exerciseName,
    set_number: setNumber,
    reps,
    weight_kg: weightKg,
  })
  revalidatePath('/workout/log')
}

export async function finishWorkoutSession(sessionId: string) {
  const supabase = await createServerClient()
  await supabase
    .from('workout_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', sessionId)
  revalidatePath('/workout')
  revalidatePath('/dashboard')
}
