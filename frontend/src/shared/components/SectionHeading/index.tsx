import { cn } from "@shared/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  eyebrow?: string;
};

/** Shared section title aligned with homepage / contact headings. */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">{title}</h2>
      <div
        className="mx-auto mb-6 h-1 w-24 rounded-full bg-to-two-right-theme-gradient"
        aria-hidden
      />
      {subtitle ? (
        <p className="text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
