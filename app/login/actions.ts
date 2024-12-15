'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirectTo: z.string().default('/')
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo')
  })

  if (!validatedFields.success) {
    redirect('/error?message=Invalid+credentials')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password
  })

  if (error) {
    redirect('/login?message=Invalid+credentials')
  }

  revalidatePath('/', 'layout')
  redirect(validatedFields.data.redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo')
  })

  if (!validatedFields.success) {
    redirect('/error?message=Invalid+credentials')
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect(validatedFields.data.redirectTo)
}

export async function signInWithGoogle(origin: string, next: string) {
  const supabase = await createClient()
  
  const encodedNext = encodeURIComponent(next)
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodedNext}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'openid email profile'
    },
  })


  if (error) {
    redirect('/error?message=Google+sign+in+failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}