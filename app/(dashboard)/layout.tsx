import NavbarContainer from '@/components/navigation/NavbarContainer'
import SidebarContainer from '@/components/navigation/SidebarContainer'

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='flex w-full relative'>
      <SidebarContainer />
      <div className='flex-1 lg:absolute left-60 right-0'>
        <NavbarContainer />
        <main className='p-4'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
