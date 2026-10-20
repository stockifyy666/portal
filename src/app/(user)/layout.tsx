export const instant = false

import { io } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, supabaseReady } from '@/lib/supabase/server'
import UserShell from '@/components/layouts/UserShell'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await io()
  if (!supabaseReady) redirect('/auth/login')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .single()

  // Query error (e.g. RLS issue) — don't redirect, render with auth user data as fallback

  // Profile missing (PGRST116 = no rows) — auto-create with user role
  if (!profile) {
    await supabase.from('profiles').insert({
      user_id: user.id,
      email: user.email,
      role: 'user',
    })
  }

  const role = profile?.role ?? 'user'

  // Admins/superadmins don't belong on the user dashboard
  if (role === 'superadmin') redirect('/superadmin/dashboard')
  if (role === 'admin') redirect('/admin/dashboard')

  return (
    <UserShell
      userEmail={profile?.email ?? user.email ?? ''}
      userName={profile?.full_name ?? undefined}
    >
      {children}
    </UserShell>
  )
}
