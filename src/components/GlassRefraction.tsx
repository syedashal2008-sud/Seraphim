interface GlassRefractionProps {
  subtle?: boolean;
}

export function GlassRefraction({ subtle = false }: GlassRefractionProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/85 to-transparent dark:via-white/50"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-14 right-4 rounded-full ${
          subtle
            ? 'h-28 w-36 bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.09)_0%,transparent_70%)]'
            : 'h-36 w-48 bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.13)_0%,transparent_70%)]'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-14 left-4 rounded-full ${
          subtle
            ? 'h-28 w-40 bg-[radial-gradient(circle,rgba(136,0,33,0.07)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)]'
            : 'h-36 w-52 bg-[radial-gradient(circle,rgba(136,0,33,0.10)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]'
        }`}
      />
    </>
  );
}
