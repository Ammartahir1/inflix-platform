interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  subtitle?: string
}

const sizes = {
  sm:  'text-lg',
  md:  'text-xl',
  lg:  'text-2xl',
  xl:  'text-4xl',
}

export function Logo({ size = 'md', subtitle }: LogoProps) {
  return (
    <div className="flex flex-col items-start">
      <span className={`font-black tracking-tight select-none font-mono ${sizes[size]}`}>
        <span className="text-blue-500">&lt;</span>
        <span className="text-white">inflix</span>
        <span className="text-blue-500">/&gt;</span>
      </span>
      {subtitle && (
        <span className="text-[10px] text-white/30 font-sans tracking-widest uppercase leading-none mt-0.5 ml-0.5">
          {subtitle}
        </span>
      )}
    </div>
  )
}
