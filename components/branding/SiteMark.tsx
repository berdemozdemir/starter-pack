import { cn } from '@/lib/utils';

type SiteMarkProps = {
  className?: string;
};

/** Minimal brand mark for auth shells and headers. Swap for your logo when bootstrapping. */
export function SiteMark(props: SiteMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('text-current', props.className)}
    >
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="8"
        className="stroke-current"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        d="M12 26V14h4.2c2.6 0 4.2 1.4 4.2 3.5 0 1.4-.7 2.5-1.9 3.1L23 26h-3.3l-3.4-4.8H15.2V26H12Zm3.2-7.2h1c1.1 0 1.8-.5 1.8-1.4s-.7-1.4-1.8-1.4h-1v2.8Z"
        className="fill-current"
      />
      <path d="M25 26V14h3.1v12H25Z" className="fill-current" opacity="0.85" />
    </svg>
  );
}
