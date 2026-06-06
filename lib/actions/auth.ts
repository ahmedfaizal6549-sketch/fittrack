'use server'

import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = await createServerClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createServerClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  if (data.user) {
    await supabase.from('user_profiles').upsert({
      id: data.user.id,
      display_name: name || email.split('@')[0],
      calorie_goal: 1800,
      water_goal_ml: 2000,
      step_goal: 10000,
    })
  }

  redirect('/')
}

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
