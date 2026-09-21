import { SearchIcon } from 'lucide-react'
import { cn } from '@admin/lib/utils'
import { useSearch } from '@admin/context/search-provider'
import { Button } from './ui/button'

export function Search({
  className = '',
  placeholder = 'Search',
  ...props
}: React.ComponentProps<'button'> & { placeholder?: string }) {
  const { setOpen } = useSearch()
  return (
    <Button
      {...props}
      variant='outline'
      size='sm'
      className={cn(
        'group h-8 w-full min-w-0 flex-1 justify-start gap-2 bg-muted/25 font-normal text-muted-foreground shadow-none hover:bg-accent sm:w-40 md:flex-none lg:w-52 xl:w-64',
        className
      )}
      aria-keyshortcuts='Meta+K Control+K'
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden='true'
        className='size-4 shrink-0 text-muted-foreground/70'
      />
      <span className='truncate'>{placeholder}</span>
      <kbd className='pointer-events-none ms-auto hidden h-5 shrink-0 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium group-hover:bg-accent sm:inline-flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  )
}
