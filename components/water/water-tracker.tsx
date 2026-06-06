'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { logWater } from '@/lib/actions/water'
import { Droplets, Plus } from 'lucide-react'

const QUICK_AMOUNTS = [
  { label: '1 Glass', ml: 250 },
  { label: '500ml', ml: 500 },
  { label: '750ml', ml: 750 },
  { label: '1L', ml: 1000 },
]

export function WaterTracker({ entries, total, goal }: { entries: any[], total: number, goal: number }) {
  const [loading, setLoading] = useState<number | null>(null)

  const glasses = Math.floor(total / 250)
  const totalGlasses = Math.floor(goal / 250)
  const pct = Math.min((total / goal) * 100, 100)

  async function handleLog(ml: number) {
    setLoading(ml)
    await logWater(ml)
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {/* Visual tracker */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="font-mono text-4xl font-bold text-blue-600">{(total / 1000).toFixed(2)}L</p>
            <p className="text-sm text-muted-foreground mt-1">of {goal / 1000}L goal ({Math.round(pct)}%)</p>
          </div>
          <Progress value={pct} className="h-3 [&>div]:bg-blue-500" />

          {/* Glass icons */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {Array.from({ length: totalGlasses }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  i < glasses ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Droplets className="w-4 h-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick add buttons */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Quick add</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_AMOUNTS.map(({ label, ml }) => (
              <Button
                key={ml}
                variant="outline"
                onClick={() => handleLog(ml)}
                disabled={loading === ml}
                className="flex items-center gap-2 h-11"
              >
                <Plus className="w-4 h-4" />
                {loading === ml ? 'Adding…' : label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
