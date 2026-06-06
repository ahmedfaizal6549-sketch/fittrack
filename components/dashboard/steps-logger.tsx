'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Footprints } from 'lucide-react'
import { logSteps } from '@/lib/actions/weight'

export function StepsLogger({ currentSteps }: { currentSteps: number }) {
  const [steps, setSteps] = useState(currentSteps > 0 ? String(currentSteps) : '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!steps) return
    setSaving(true)
    await logSteps(parseInt(steps))
    setSaving(false)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Footprints className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">Log Today&apos;s Steps</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="e.g. 10000"
            value={steps}
            onChange={e => setSteps(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? '…' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
