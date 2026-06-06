'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logMeal(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]
  await supabase.from('meal_entries').insert({
    user_id: user.id,
    logged_at: today,
    meal_type: formData.get('meal_type') as string,
    name: formData.get('name') as string,
    calories: parseInt(formData.get('calories') as string),
    protein_g: formData.get('protein_g') ? parseFloat(formData.get('protein_g') as string) : null,
  })
  revalidatePath('/diet')
  revalidatePath('/dashboard')
}

export async function deleteMeal(id: string) {
  const supabase = await createServerClient()
  await supabase.from('meal_entries').delete().eq('id', id)
  revalidatePath('/diet')
  revalidatePath('/dashboard')
}
