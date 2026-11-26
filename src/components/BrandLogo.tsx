interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'h-10 w-10 lg:h-9 lg:w-9' }: BrandLogoProps) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      {/* Light theme logo */}
      <img
        src="/assets/aistudio/image_a27d5327.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="block h-full w-full object-contain select-none dark:hidden"
      />
      {/* Dark theme logo (normalized scale/offset so visible artwork matches light logo size) */}
      <img
        src="/assets/aistudio/image_f5b2736a.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="hidden h-full w-full -translate-y-[5%] scale-[1.36] object-contain select-none dark:block"
      />
    </span>
  );
}
