'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { logSet, finishWorkoutSession } from '@/lib/actions/workout'
import { CheckCircle2, Plus, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react'

interface Exercise {
  id: string
  exercise_name: string
  sets_target: number
  reps_target: string
  rest_seconds: number
  notes: string
}

interface LoggedSet {
  id: string
  exercise_name: string
  set_number: number
  reps: number
  weight_kg: number
}

export function WorkoutSession({ sessionId, exercises, loggedSets }: {
  sessionId: string
  exercises: Exercise[]
  loggedSets: LoggedSet[]
}) {
  const router = useRouter()
  const [sets, setSets] = useState<LoggedSet[]>(loggedSets)
  const [reps, setReps] = useState<Record<string, string>>({})
  const [weight, setWeight] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(exercises[0]?.exercise_name ?? null)
  const [finishing, setFinishing] = useState(false)
  const [addExercise, setAddExercise] = useState(false)
  const [customEx, setCustomEx] = useState('')

  const allExerciseNames = [
    ...exercises.map(e => e.exercise_name),
    ...Array.from(new Set(sets.map(s => s.exercise_name).filter(n => !exercises.find(e => e.exercise_name === n))))
  ]

  async function handleLogSet(exerciseName: string) {
    const r = parseInt(reps[exerciseName] || '0')
    const w = parseFloat(weight[exerciseName] || '0')
    if (!r) return
    setSaving(exerciseName)

    const prevSets = sets.filter(s => s.exercise_name === exerciseName)
    const setNumber = prevSets.length + 1
    await logSet(sessionId, exerciseName, setNumber, r, w)

    const newSet: LoggedSet = { id: Date.now().toString(), exercise_name: exerciseName, set_number: setNumber, reps: r, weight_kg: w }
    setSets(prev => [...prev, newSet])
    setSaving(null)
  }

  async function handleFinish() {
    setFinishing(true)
    await finishWorkoutSession(sessionId)
    router.push('/workout')
  }

  async function handleAddCustom() {
    if (!customEx.trim()) return
    setExpanded(customEx.trim())
    setAddExercise(false)
    setCustomEx('')
  }

  return (
    <div className="space-y-4">
      {allExerciseNames.map(name => {
        const exercise = exercises.find(e => e.exercise_name === name)
        const exSets = sets.filter(s => s.exercise_name === name)
        const isExpanded = expanded === name
        const target = exercise?.sets_target ?? '?'
        const done = exSets.length

        return (
          <Card key={name} className={done >= Number(target) ? 'border-green-200' : ''}>
            <CardHeader
              className="pb-2 pt-4 cursor-pointer"
              onClick={() => setExpanded(isExpanded ? null : name)}
            >
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {done >= Number(target) && Number(target) > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Dumbbell className="w-4 h-4 text-primary" />
                  )}
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{done}/{target} sets</Badge>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </CardTitle>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0 space-y-3">
                {exercise?.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">{exercise.notes}</p>
                )}
                {exercise && (
                  <p className="text-xs text-muted-foreground">Target: {exercise.sets_target} × {exercise.reps_target} reps | Rest: {exercise.rest_seconds}s</p>
                )}

                {/* Logged sets */}
                {exSets.length > 0 && (
                  <div className="space-y-1">
                    {exSets.map(s => (
                      <div key={s.id} className="flex items-center justify-between text-sm bg-green-50 rounded-lg px-3 py-1.5">
                        <span className="text-muted-foreground">Set {s.set_number}</span>
                        <span className="font-mono font-medium">{s.reps} reps {s.weight_kg > 0 ? `@ ${s.weight_kg}kg` : '(bodyweight)'}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Log set form */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
                    <Input
                      type="number"
                      placeholder="12"
                      value={reps[name] || ''}
                      onChange={e => setReps(prev => ({ ...prev, [name]: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="0 = bodyweight"
                      value={weight[name] || ''}
                      onChange={e => setWeight(prev => ({ ...prev, [name]: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleLogSet(name)}
                  disabled={saving === name}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {saving === name ? 'Saving…' : `Log Set ${exSets.length + 1}`}
                </Button>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Add custom exercise */}
      {!addExercise ? (
        <Button variant="outline" className="w-full" onClick={() => setAddExercise(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      ) : (
        <Card>
          <CardContent className="p-4 flex gap-2">
            <Input
              placeholder="Exercise name"
              value={customEx}
              onChange={e => setCustomEx(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
            />
            <Button onClick={handleAddCustom}>Add</Button>
            <Button variant="outline" onClick={() => setAddExercise(false)}>Cancel</Button>
          </CardContent>
        </Card>
      )}

      {/* Finish button */}
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={handleFinish}
        disabled={finishing}
      >
        {finishing ? 'Saving…' : '✓ Finish Workout'}
      </Button>
    </div>
  )
}
