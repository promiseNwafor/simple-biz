'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvoiceSchemaValues, InvoiceSchema } from '@/schemas'
import { useSendInvoice } from '@/store/useStoreData'
import { Form } from '@/components/ui/form'
import SelectInvoiceProducts from './SelectInvoiceProducts'
import InvoiceDetails from './InvoiceDetails'

const defaultMessage = 'Hello, here is the detail of your invoice.'

export type SelectedProducts = {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

type InvoiceFormProps = {
  toggleModal: () => void
}

const InvoiceForm: React.FC<InvoiceFormProps> = () => {
  const [pdfData, setPdfData] = useState('')
  const [isPending, startTransition] = useTransition()
  const { mutateAsync: sendInvoice } = useSendInvoice()

  const router = useRouter()
  const searchParams = useSearchParams()

  const modalScreen = searchParams.get('screen')

  const form = useForm<InvoiceSchemaValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      selectedProducts: [],
      client: undefined,
      dueDate: undefined,
      message: defaultMessage,
    },
  })

  const { handleSubmit, control } = form

  const onSubmit = async (values: InvoiceSchemaValues) => {
    startTransition(async () => {
      try {
        const res = await sendInvoice(values)
        if (res.success) {
          toast.success(res.success)
          setPdfData(res.data)
        }
        return
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong!')
      }
    })
  }

  const handleNextClick = (screen: number) => {
    const params = new URLSearchParams()
    params.set('screen', screen.toString())

    router.push(`?${params.toString()}`)
  }

  const modalComponent = () => {
    switch (modalScreen) {
      case '1':
        return (
          <SelectInvoiceProducts
            form={form}
            handleNextClick={handleNextClick}
          />
        )
      case '2':
        return <InvoiceDetails control={control} isPending={isPending} />
      default:
        return (
          <SelectInvoiceProducts
            form={form}
            handleNextClick={handleNextClick}
          />
        )
    }
  }

  return (
    <div className='w-full'>
      {pdfData ? (
        <div className='mt-6'>
          <embed
            src={`data:application/pdf;base64,${pdfData}`}
            type='application/pdf'
            width='100%'
            height='600px'
          />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {modalComponent()}
          </form>
        </Form>
      )}
    </div>
  )
}

export default InvoiceForm
