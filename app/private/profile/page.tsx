import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/profile-form"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { createClient } from '@/utils/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Profile"
        text="Manage your account settings and preferences."
      />
      <div className="grid gap-10">
        <ProfileForm user={user} profile={profile} />
      </div>
    </DashboardShell>
  )
} 