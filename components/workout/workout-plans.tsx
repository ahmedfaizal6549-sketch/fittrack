'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { startWorkoutSession } from '@/lib/actions/workout'
import { ChevronDown, ChevronUp, Clock, Dumbbell } from 'lucide-react'

export function WorkoutPlans({ plans, todaySessionPlanDayId }: { plans: any[], todaySessionPlanDayId: string | null }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [starting, setStarting] = useState<string | null>(null)

  async function handleStart(planDayId: string) {
    setStarting(planDayId)
    const sessionId = await startWorkoutSession(planDayId)
    if (sessionId) {
      router.push(`/workout/log?sessionId=${sessionId}&planDayId=${planDayId}`)
    }
    setStarting(null)
  }

  if (plans.length === 0) return <p className="text-sm text-muted-foreground">Loading plan…</p>

  return (
    <div className="space-y-4">
      {plans.map((plan: any) => (
        <div key={plan.id}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-semibold">{plan.name}</h2>
            {plan.is_active && <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Active</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>

          <div className="space-y-2">
            {plan.plan_days
              ?.sort((a: any, b: any) => a.day_order - b.day_order)
              .map((day: any) => {
                const isExpanded = expanded === day.id
                const isToday = todaySessionPlanDayId === day.id
                return (
                  <Card key={day.id} className={isToday ? 'border-primary/40 bg-primary/5' : ''}>
                    <CardHeader
                      className="pb-2 pt-4 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : day.id)}
                    >
                      <CardTitle className="text-sm font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-primary" />
                          {day.day_label}
                          {isToday && <Badge className="text-xs bg-green-100 text-green-700 ml-1">Today ✓</Badge>}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </CardTitle>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0 space-y-3">
                        <div className="space-y-2">
                          {day.plan_exercises
                            ?.sort((a: any, b: any) => a.order_index - b.order_index)
                            .map((ex: any) => (
                              <div key={ex.id} className="bg-muted/50 rounded-lg p-3 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{ex.exercise_name}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{ex.sets_target} sets × {ex.reps_target}</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />{ex.rest_seconds}s
                                    </span>
                                  </div>
                                </div>
                                {ex.notes && <p className="text-xs text-muted-foreground leading-relaxed">{ex.notes}</p>}
                              </div>
                            ))}
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleStart(day.id)}
                          disabled={starting === day.id}
                        >
                          {starting === day.id ? 'Starting…' : isToday ? 'Log Another Session' : 'Start This Workout →'}
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
