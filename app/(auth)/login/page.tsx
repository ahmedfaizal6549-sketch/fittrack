'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = mode === 'login' ? await signIn(formData) : await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg border-border/50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">FitTrack</CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Welcome back! Log in to continue.' : 'Create your account to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <Input name="name" placeholder="Your name" required />
          )}
          <Input name="email" type="email" placeholder="Email address" required />
          <Input name="password" type="password" placeholder="Password (min 6 chars)" minLength={6} required />
          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
            className="text-primary font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
