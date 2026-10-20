export const instant = false

import { io } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, supabaseReady } from '@/lib/supabase/server'
import Sidebar from '@/components/layouts/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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

  // Server error (e.g. RLS infinite recursion) — sign out to break any redirect loop
  if (profileError && profileError.code !== 'PGRST116') {
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  if (!['admin', 'superadmin'].includes(profile?.role ?? '')) redirect('/auth/login')

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role="admin"
        userEmail={profile?.email ?? user.email ?? ''}
        userName={profile?.full_name ?? undefined}
      />
      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--navy-950)' }}>
        {children}
      </main>
    </div>
  )
}
