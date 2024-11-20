'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    redirect('/error?message=Invalid+credentials')
  }

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    redirect('/error?message=Invalid+credentials')
  }

  const { error } = await supabase.auth.signUp(validatedFields.data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect('/error?message=Google+sign+in+failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}