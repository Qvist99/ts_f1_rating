import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export async function ProtectedContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }
  const username = user.identities?.[0]?.identity_data?.name


  return (
    <div>
      user: {username}
    </div>
  )
}


export default function Protected() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedContent />
    </Suspense>
  )
}
