'use client'

import { UserInfo } from '@/components/reusables/UserInfo'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const ClientPage = () => {
  const user = useCurrentUser()

  return <UserInfo label='📱 Client component' user={user} />
}

export default ClientPage
