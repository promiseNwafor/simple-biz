'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { RegisterFormValues, RegisterFormSchema } from '@/schemas'
import { register } from '@/actions/register'
import { Form } from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import UserDetailsContainer from './UserDetailsContainer'
import BusinessDetailsContainer from './BusinessDetailsContainer'
import AuthWrapper from './AuthWrapper'
import { AuthError } from './AuthError'
import { AuthSuccess } from './AuthSuccess'

const RegisterContainer = () => {
  const [screen, setScreen] = useState(1)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      businessAddress: '',
      businessDescription: '',
      industry: '',
      rcNumber: '',
      acceptPolicy: false,
    },
  })

  const {
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { isSubmitSuccessful },
  } = form

  const onSubmit = (values: RegisterFormValues) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      register(values).then((res) => {
        setError(res?.error)
        setSuccess(res?.success)
      })
    })
  }

  const handleUserDetailsSubmit = async () => {
    const isValid = await trigger([
      'name',
      'email',
      'phoneNumber',
      'address',
      'password',
      'confirmPassword',
    ])
    if (!isValid) return

    setScreen(2)
  }

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  return (
    <AuthWrapper
      imageSrc={`/images/${screen === 1 ? 'invoice-bill-for-payment-of-utility.png' : 'payment-breakdown.png'}`}
    >
      <div className='w-full max-w-lg space-y-10'>
        <div className='space-y-2'>
          <h2>Welcome to Simple Biz</h2>
          <p>Please fill in the required details to continue</p>
        </div>
        <div className='flex'>
          <span
            className={`w-[28px] h-[25px] rounded-full border border-primary centered ${screen === 2 ? 'bg-primary text-primary-foreground' : 'text-primary'}`}
          >
            1
          </span>
          <Slider
            defaultValue={[50]}
            max={100}
            step={50}
            disabled
            rangeClassName={screen === 1 ? 'border-dotted' : ''}
            trackClassName={
              screen === 2 ? 'border-primary' : 'border-secondary'
            }
            thumbClassName={screen === 2 ? 'bg-primary' : ''}
          />
          <span className='w-[28px] h-[25px] rounded-full border border-primary centered text-primary'>
            2
          </span>
        </div>
        {error && <AuthError message={error} />}
        {success && <AuthSuccess message={success} />}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {screen === 1 ? (
              <UserDetailsContainer
                control={control}
                onSubmit={handleUserDetailsSubmit}
              />
            ) : (
              <BusinessDetailsContainer
                control={control}
                isPending={isPending}
              />
            )}
          </form>
        </Form>
        <div className='text-center'>
          Have an account?
          <Link href='/auth/login' className='text-md ml-1'>
            Sign in
          </Link>
        </div>
      </div>
    </AuthWrapper>
  )
}

export default RegisterContainer
