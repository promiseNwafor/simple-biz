import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetInvoices } from '@/store/useStoreData'
import InvoicesContainer from '@/components/invoices/InvoicesContainer'

const InvoicesPage = async ({
  searchParams,
}: {
  searchParams: { page: string }
}) => {
  const page = parseInt(searchParams.page) || 1

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetInvoices(page))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InvoicesContainer />
    </HydrationBoundary>
  )
}

export default InvoicesPage
