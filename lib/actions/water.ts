'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logWater(amountMl: number) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  await supabase.from('water_entries').insert({
    user_id: user.id,
    amount_ml: amountMl,
    logged_at: today,
  })
  revalidatePath('/water')
  revalidatePath('/dashboard')
}

export async function deleteWaterEntry(id: string) {
  const supabase = await createServerClient()
  await supabase.from('water_entries').delete().eq('id', id)
  revalidatePath('/water')
  revalidatePath('/dashboard')
}
