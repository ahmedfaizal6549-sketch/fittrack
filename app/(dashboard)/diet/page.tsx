import { createServerClient } from '@/lib/supabase/server'
import { MealLogger } from '@/components/diet/meal-logger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UtensilsCrossed } from 'lucide-react'
import { deleteMeal } from '@/lib/actions/diet'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default async function DietPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]
  const [mealsRes, profileRes] = await Promise.all([
    supabase.from('meal_entries').select('*').eq('user_id', user.id).eq('logged_at', today).order('created_at'),
    supabase.from('user_profiles').select('calorie_goal').eq('id', user.id).maybeSingle(),
  ])

  const meals = mealsRes.data ?? []
  const goal = profileRes.data?.calorie_goal ?? 1800
  const total = meals.reduce((sum: number, m: any) => sum + m.calories, 0)
  const pct = Math.min((total / goal) * 100, 100)

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter((m: any) => m.meal_type === type)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Diet Log</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your meals and calories</p>
      </div>

      {/* Calorie summary */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-3xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">of {goal} kcal goal</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">{goal - total > 0 ? `${goal - total} remaining` : 'Goal reached!'}</p>
              <p className="text-xs text-muted-foreground">{Math.round(pct)}%</p>
            </div>
          </div>
          <Progress value={pct} className="h-2" />
        </CardContent>
      </Card>

      {/* Log meal form */}
      <MealLogger />

      {/* Meal list by type */}
      <div className="space-y-3">
        {MEAL_TYPES.map(type => (
          <Card key={type}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold capitalize flex justify-between">
                <span>{type}</span>
                {grouped[type].length > 0 && (
                  <span className="text-muted-foreground font-normal">
                    {grouped[type].reduce((s: number, m: any) => s + m.calories, 0)} kcal
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3 px-4">
              {grouped[type].length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nothing logged yet</p>
              ) : (
                <div className="space-y-1.5">
                  {grouped[type].map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{m.name}</span>
                        {m.protein_g && <span className="text-muted-foreground ml-2 text-xs">{m.protein_g}g protein</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-medium">{m.calories} kcal</span>
                        <form action={async () => { 'use server'; await deleteMeal(m.id) }}>
                          <button type="submit" className="text-muted-foreground hover:text-destructive text-xs">✕</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
