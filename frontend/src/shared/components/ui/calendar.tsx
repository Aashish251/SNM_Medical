import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@shared/lib/utils"
import { Button, buttonVariants } from "@shared/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2.8rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-6 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10 px-0 pointer-events-none",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-100 hover:opacity-100 border-gray-200 hover:bg-gray-100 rounded-lg pointer-events-auto",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 opacity-100 hover:opacity-100 hover:bg-transparent text-gray-400 hover:text-gray-900 pointer-events-auto",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-12 w-full items-center justify-center px-8",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-10 w-full items-center justify-center gap-2 text-sm font-semibold relative z-20",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-black border-gray-200 shadow-sm relative rounded-lg border bg-white h-full inline-flex items-center justify-center transition-all hover:border-gray-300",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0 cursor-pointer w-full h-full z-30",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-bold text-gray-900",
          captionLayout === "label"
            ? "text-base"
            : "[&>svg]:text-gray-900 flex items-center gap-2 rounded-lg px-2 text-base",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse mt-2",
        weekdays: cn("flex mb-2", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-400 flex-1 select-none rounded-md text-[0.85rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center text-sm",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-gray-900 text-white rounded-l-lg",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-gray-100", defaultClassNames.range_middle),
        range_end: cn("bg-gray-900 text-white rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "bg-gray-100 text-gray-900 rounded-lg",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-300 aria-selected:text-gray-400 opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-gray-200 opacity-25 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4 text-gray-400", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-gray-900 data-[selected-single=true]:text-white data-[range-middle=true]:bg-gray-100 data-[range-middle=true]:text-gray-900 data-[range-start=true]:bg-gray-900 data-[range-start=true]:text-white data-[range-end=true]:bg-gray-900 data-[range-end=true]:text-white flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-lg data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-lg [&>span]:text-xs [&>span]:opacity-70 rounded-lg hover:bg-gray-100 hover:text-gray-900",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
