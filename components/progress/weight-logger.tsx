'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { logWeight } from '@/lib/actions/weight'
import { Scale } from 'lucide-react'

export function WeightLogger({ currentWeight }: { currentWeight?: number }) {
  const [weight, setWeight] = useState(currentWeight ? String(currentWeight) : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!weight) return
    setSaving(true)
    await logWeight(parseFloat(weight))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Log Today&apos;s Weight</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.1"
            placeholder="e.g. 95.5"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="flex-1"
          />
          <span className="flex items-center text-sm text-muted-foreground">kg</span>
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saved ? '✓ Saved!' : saving ? '…' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
