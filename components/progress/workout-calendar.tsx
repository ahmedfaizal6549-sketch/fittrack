'use client'

export function WorkoutCalendar({ sessionDates }: { sessionDates: string[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dateSet = new Set(sessionDates.map(d => d.slice(0, 10)))

  const cells = []
  // Empty cells for first week offset
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div>
      <p className="text-sm font-medium text-center mb-3">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasWorkout = dateSet.has(dateStr)
          const isToday = day === today.getDate()
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                ${hasWorkout ? 'bg-primary text-primary-foreground' : ''}
                ${isToday && !hasWorkout ? 'border-2 border-primary text-primary' : ''}
                ${!hasWorkout && !isToday ? 'text-muted-foreground' : ''}
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 justify-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary inline-block" /> Workout day</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-primary inline-block" /> Today</span>
      </div>
    </div>
  )
}
