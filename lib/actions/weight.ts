'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logWeight(weightKg: number, note?: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  await supabase.from('weight_entries').upsert({
    user_id: user.id,
    logged_at: today,
    weight_kg: weightKg,
    note: note || null,
  }, { onConflict: 'user_id,logged_at' })
  revalidatePath('/progress')
  revalidatePath('/dashboard')
}

export async function logSteps(steps: number) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  await supabase.from('step_entries').upsert({
    user_id: user.id,
    logged_at: today,
    steps,
  }, { onConflict: 'user_id,logged_at' })
  revalidatePath('/dashboard')
}
