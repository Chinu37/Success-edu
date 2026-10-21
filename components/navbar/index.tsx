import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileSidebar } from '@/components/sidebar/mobile-sidebar'

export const Navbar = () => {
  return (
    <div className="p-4 h-full flex items-center bg-[#010409] border-b border-white/50 shadow-2xl">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}