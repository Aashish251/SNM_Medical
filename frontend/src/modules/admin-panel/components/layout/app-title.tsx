import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { SNM_WEBSITE_LOGO } from '@assets/index'
import { SNM_SITE_LOGO_TITLE } from '@shared/constants'
import { ADMIN_PANEL_DASHBOARD } from '@admin-panel/constants/routePaths'
import { cn } from '@admin-panel/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@admin-panel/components/ui/sidebar'
import { Button } from '../ui/button'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-white/10 active:bg-white/10'
          asChild
        >
          <div className='flex w-full items-center'>
            <Link
              to={ADMIN_PANEL_DASHBOARD}
              onClick={() => setOpenMobile(false)}
              className='flex min-w-0 flex-1 items-center gap-2 text-start'
            >
              <img
                src={SNM_WEBSITE_LOGO}
                alt={SNM_SITE_LOGO_TITLE}
                className='size-8 shrink-0 rounded-full border-2 border-white shadow-sm'
              />
              <div className='min-w-0 leading-tight'>
                <span className='block truncate font-bold text-white'>
                  {SNM_SITE_LOGO_TITLE}
                </span>
                <span className='block truncate text-xs text-white/75'>
                  Admin Portal
                </span>
              </div>
            </Link>
            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      size='icon'
      className={cn(
        'aspect-square size-8 shrink-0 text-white hover:bg-white/10 hover:text-white max-md:scale-125',
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <X className='md:hidden' />
      <Menu className='max-md:hidden' />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}
