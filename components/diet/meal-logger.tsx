'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { logMeal } from '@/lib/actions/diet'
import { Plus, UtensilsCrossed } from 'lucide-react'

const MEAL_SUGGESTIONS: Record<string, { name: string; calories: number; protein?: number }[]> = {
  breakfast: [{ name: 'Roti & Egg', calories: 250, protein: 12 }, { name: 'Bread & Butter', calories: 200 }],
  lunch: [{ name: 'Rice & Curry', calories: 550, protein: 25 }, { name: 'Rice & Dhal', calories: 480, protein: 18 }],
  dinner: [{ name: 'Rice & Curry', calories: 550, protein: 25 }, { name: 'Roti & Curry', calories: 350, protein: 15 }],
  snack: [{ name: 'Banana', calories: 90, protein: 1 }, { name: 'Biscuits', calories: 120 }, { name: 'Fruits', calories: 80 }],
}

export function MealLogger() {
  const [open, setOpen] = useState(false)
  const [mealType, setMealType] = useState('lunch')
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [saving, setSaving] = useState(false)

  function fillSuggestion(s: { name: string; calories: number; protein?: number }) {
    setName(s.name)
    setCalories(String(s.calories))
    setProtein(s.protein ? String(s.protein) : '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !calories) return
    setSaving(true)
    const fd = new FormData()
    fd.set('meal_type', mealType)
    fd.set('name', name)
    fd.set('calories', calories)
    if (protein) fd.set('protein_g', protein)
    await logMeal(fd)
    setName(''); setCalories(''); setProtein('')
    setSaving(false)
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            Log a meal
          </span>
          <Plus className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-45' : ''}`} />
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-3">
          <Select value={mealType} onValueChange={(v) => v && setMealType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['breakfast', 'lunch', 'dinner', 'snack'].map(t => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Suggestions */}
          {MEAL_SUGGESTIONS[mealType] && (
            <div className="flex flex-wrap gap-2">
              {MEAL_SUGGESTIONS[mealType].map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => fillSuggestion(s)}
                  className="text-xs px-2 py-1 bg-muted rounded-lg hover:bg-accent transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input placeholder="Food name (e.g. Rice & Curry)" value={name} onChange={e => setName(e.target.value)} required />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} required />
              <Input type="number" placeholder="Protein g (optional)" value={protein} onChange={e => setProtein(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving…' : 'Add Meal'}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
