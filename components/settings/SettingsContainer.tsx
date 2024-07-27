'use client'

import { BeatLoader } from 'react-spinners'
import { useQuery } from '@tanstack/react-query'
import { useGetBusiness, useGetCurrentUser } from '@/store/useUserData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSettingsContainer from './ProfileSettingsContainer'

const SettingsContainer = () => {
  const { data: userData, isPending: userIsPending } =
    useQuery(useGetCurrentUser())
  const { data: businessData, isPending: businessIsPending } =
    useQuery(useGetBusiness())

  const user = userData?.user
  const business = businessData?.data

  const userIsLoading = userIsPending || !user
  const businessIsLoading = businessIsPending || !business

  return (
    <div className='space-y-8 bg-white rounded-lg min-h-screen p-6'>
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='notification'>Notification</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          {userIsLoading || businessIsLoading ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <ProfileSettingsContainer user={user} business={business} />
          )}
        </TabsContent>
        <TabsContent value='notification'>
          Change your notification here.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsContainer
