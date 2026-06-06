import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Droplets, UtensilsCrossed, Footprints, Dumbbell, Trophy } from 'lucide-react'
import Link from 'next/link'
import { seedWorkoutPlan } from '@/lib/actions/workout'
import { StepsLogger } from '@/components/dashboard/steps-logger'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Seed workout plan on first load
  await seedWorkoutPlan()

  const today = new Date().toISOString().split('T')[0]
  const greeting = getGreeting()

  const [waterRes, mealsRes, stepsRes, sessionRes, profileRes, weightRes] = await Promise.all([
    supabase.from('water_entries').select('amount_ml').eq('user_id', user.id).eq('logged_at', today),
    supabase.from('meal_entries').select('calories').eq('user_id', user.id).eq('logged_at', today),
    supabase.from('step_entries').select('steps').eq('user_id', user.id).eq('logged_at', today).maybeSingle(),
    supabase.from('workout_sessions').select('id, ended_at').eq('user_id', user.id).eq('logged_at', today).maybeSingle(),
    supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('weight_entries').select('weight_kg, logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const profile = profileRes.data
  const waterTotal = waterRes.data?.reduce((sum, e) => sum + e.amount_ml, 0) ?? 0
  const calorieTotal = mealsRes.data?.reduce((sum, e) => sum + e.calories, 0) ?? 0
  const steps = stepsRes.data?.steps ?? 0
  const workoutDone = !!sessionRes.data
  const waterGoal = profile?.water_goal_ml ?? 2000
  const calorieGoal = profile?.calorie_goal ?? 1800
  const stepGoal = profile?.step_goal ?? 10000
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'there'

  // Next workout day
  const planDaysRes = await supabase
    .from('plan_days')
    .select('id, day_label, day_order, workout_plans!inner(user_id, is_active)')
    .eq('workout_plans.user_id', user.id)
    .eq('workout_plans.is_active', true)
    .order('day_order')

  const lastSessionRes = await supabase
    .from('workout_sessions')
    .select('plan_day_id')
    .eq('user_id', user.id)
    .not('plan_day_id', 'is', null)
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const planDays = planDaysRes.data ?? []
  const lastDayId = lastSessionRes.data?.plan_day_id
  const lastDayIndex = planDays.findIndex(d => d.id === lastDayId)
  const nextDay = planDays[(lastDayIndex + 1) % planDays.length] ?? planDays[0]

  const stats = [
    { label: 'Water', value: `${(waterTotal / 1000).toFixed(1)}L`, goal: `${waterGoal / 1000}L`, pct: Math.min((waterTotal / waterGoal) * 100, 100), icon: Droplets, color: 'text-blue-500', href: '/water' },
    { label: 'Calories', value: `${calorieTotal}`, goal: `${calorieGoal} kcal`, pct: Math.min((calorieTotal / calorieGoal) * 100, 100), icon: UtensilsCrossed, color: 'text-orange-500', href: '/diet' },
    { label: 'Steps', value: steps.toLocaleString(), goal: `${stepGoal.toLocaleString()} steps`, pct: Math.min((steps / stepGoal) * 100, 100), icon: Footprints, color: 'text-green-500', href: '/dashboard' },
    { label: 'Workout', value: workoutDone ? 'Done!' : 'Pending', goal: 'gym session', pct: workoutDone ? 100 : 0, icon: Dumbbell, color: 'text-primary', href: '/workout' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">{greeting}</p>
        <h1 className="text-2xl font-bold mt-0.5">{displayName} 💪</h1>
        <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Weight banner */}
      {weightRes.data && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Current weight</span>
            </div>
            <span className="font-mono font-bold text-primary">{weightRes.data.weight_kg} kg</span>
          </CardContent>
        </Card>
      )}

      {/* Daily stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, goal, pct, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="font-mono text-xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">of {goal}</p>
                </div>
                <Progress value={pct} className="h-1.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Next workout */}
      {nextDay && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Next Workout</span>
              {workoutDone && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Today done ✓</Badge>}
            </div>
            <p className="font-semibold">{nextDay.day_label}</p>
            <Link href="/workout">
              <button className="mt-3 w-full py-2 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                {workoutDone ? 'View Plan' : 'Start Workout →'}
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Steps logger */}
      <StepsLogger currentSteps={steps} />
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning!'
  if (h < 17) return 'Good afternoon!'
  return 'Good evening!'
}
