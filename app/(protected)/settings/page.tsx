import SettingsContainer from '@/components/SettingsContainer'
import { currentUser } from '@/lib/auth'

const SettingsPage = async () => {
  const user = await currentUser()

  return user ? <SettingsContainer user={user} /> : <p>No user returned</p>
}

export default SettingsPage
