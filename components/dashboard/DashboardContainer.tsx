'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BeatLoader } from 'react-spinners'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  storeQueryKeys,
  useGetDashboardData,
  useGetSalesTrendData,
} from '@/store/useStoreData'
import { ngnFormatter } from '@/lib'
import { Pages } from '@/routes'
import { SalesDataRange } from '@/constants'
import AddButton from '@/components/reusables/AddButton'
import GoToButton from '@/components/reusables/GoToButton'
import OverviewCard from '@/components/reusables/OverviewCard'
import DashboardChartContainer, { SalesData } from './DashboardChartContainer'
import Modal from '@/components/reusables/Modal'
import InvoiceForm from '@/components/invoices/InvoiceForm'

export const dashboardFeaturedItems = [
  { label: 'No. of Clients', key: 'clientsNo' },
  { label: 'Catalogue Size', key: 'productsNo' },
  { label: 'Pending Invoices', key: 'pendingInvoicesNo' },
  { label: ' Expired Invoices', key: 'expiredInvoicesNo' },
]

const DashboardContainer = () => {
  const searchParams = useSearchParams()
  const defaultRange =
    (searchParams.get('range')?.toString() as SalesDataRange) ||
    SalesDataRange.ALL_TIME

  const [range, setRange] = useState(defaultRange)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: dashboardData, isPending: dashboardIsPending } = useQuery(
    useGetDashboardData()
  )
  const { data: salesTrendData } = useQuery(useGetSalesTrendData(range))

  const queryClient = useQueryClient()
  const router = useRouter()

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handleRangeSelect = async (range: SalesDataRange) => {
    const params = new URLSearchParams()
    params.set('range', range.toString())

    router.push(`?${params.toString()}`)
    setRange(range)
    await queryClient.invalidateQueries({
      queryKey: [storeQueryKeys.getSalesTrendData],
    })
  }

  const dashboard = dashboardData?.data
  const salesData = salesTrendData?.data

  return (
    <div className='space-y-6'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={<InvoiceForm toggleModal={toggleModal} />}
        title='Generate Invoice'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Generate Invoice</AddButton>
      </div>

      {dashboardData?.error ? (
        <p className='text-center'>{dashboardData.error}</p>
      ) : (
        <>
          {dashboardIsPending || !dashboard ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
                {dashboardFeaturedItems.map((item) => {
                  const { label, key } = item
                  return (
                    <OverviewCard
                      key={key}
                      label={label}
                      title={(dashboard as any)[key]}
                    />
                  )
                })}
              </div>

              {/* Trend */}
              <div className='w-full grid lg:grid-cols-3 gap-6'>
                <Suspense fallback={<BeatLoader color='#008678' />}>
                  <DashboardChartContainer
                    salesData={salesData as SalesData}
                    handleRangeSelect={handleRangeSelect}
                    range={range}
                  />
                </Suspense>
                <div className='bg-white p-6 rounded-lg h-full flex flex-col justify-between gap-4'>
                  <div className='grid md:grid-cols-2 lg:grid-cols-1 gap-6'>
                    <OverviewCard
                      label='Wallet Balance'
                      title={ngnFormatter.format(
                        dashboard.walletBalance as number
                      )}
                      className='bg-[#FFF6DA] pl-4'
                      labelClassName='text-black'
                    />
                    <OverviewCard
                      label='Total Earnings'
                      title={ngnFormatter.format(
                        dashboard.totalEarnings as number
                      )}
                      className='bg-primary-light pl-4'
                      labelClassName='text-black'
                    />
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-xs'>
                      From {dashboard.paymentsNo} payments
                    </p>
                    <GoToButton
                      onClick={() => {
                        router.push(Pages.PAYMENTS)
                      }}
                    >
                      See all transactions
                    </GoToButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default DashboardContainer
