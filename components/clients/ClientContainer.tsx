'use client'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Client } from '@prisma/client'

import useActionMenus from '@/hooks/useActionMenus'
import { GetResponse } from '@/types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import OverviewCard from '@/components/reusables/OverviewCard'
import Modal from '@/components/reusables/Modal'
import { MenuActions } from './ClientRow'

const orders = [
  { label: 'All Orders', title: '15' },
  { label: 'Completed Orders', title: '12' },
  { label: 'Pending Orders', title: '3' },
]

interface IClientContainer {
  data: GetResponse<Client>
}

const ClientContainer: React.FC<IClientContainer> = ({ data }) => {
  const { data: clientData, error, success } = data
  const client = clientData?.data

  const { modalAction, setModalAction, actionMenus } = useActionMenus(
    client as Client
  )

  if (!success) {
    toast.error(error)
    return
  }

  return (
    <div className='space-y-8'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div className='flex items-center justify-end gap-4'>
        <Button
          onClick={() => setModalAction(MenuActions.DELETE)}
          variant='destructive-outline'
          size='sm'
          className='py-5'
        >
          <Trash2 />
        </Button>
        <Button onClick={() => setModalAction(MenuActions.EDIT)}>
          Edit client info
        </Button>
      </div>
      <div className='bg-white rounded-lg p-5 flex gap-8 h-[320px]'>
        <div className='w-[360px]'>
          <AspectRatio ratio={16 / 9}>
            <Image
              src='/images/placeholder.png'
              alt='Image'
              width={360}
              height={360}
              className='rounded-md object-cover'
            />
          </AspectRatio>
        </div>
        <div className='flex flex-col justify-between h-full'>
          <div className='space-y-1'>
            <h2>{client?.name}</h2>
            <p className='text-base font-medium space-x-5'>
              <span>{client?.email}</span>
              <span>{client?.phone}</span>
            </p>
          </div>
          <div className='w-[300px]'>
            <OverviewCard
              label='All time payments'
              title='₦248,054'
              className='bg-primary-light pl-4 h-[120px]'
              labelClassName='text-black'
            />
          </div>
        </div>
      </div>

      <div className='grid sm:grid-cols-3 gap-4 lg:gap-8'>
        {orders.map((order) => {
          const { label, title } = order
          return <OverviewCard key={label} label={label} title={title} />
        })}
      </div>
    </div>
  )
}

export default ClientContainer