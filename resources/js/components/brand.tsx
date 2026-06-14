type BrandProps = {
  subtitle?: string;
  showText?: boolean;
  className?: string;
};

export default function Brand({
  subtitle = "WORKSPACE",
  showText = true,
  className = "",
}: BrandProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandMark className="h-[34px] w-[34px] shrink-0" />
      {showText && (
        <div className="leading-none">
          <span className="font-display text-[18px] font-bold tracking-[0.14em] text-white">
            NEXUS
          </span>
          <span className="mt-1.5 block font-mono text-[9px] tracking-[0.22em] text-[#93c5fd]">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}

function BrandMark({ className }: { className?: string }) {
  const nodes: [number, number][] = [
    [0, -55], [48, -28], [48, 28], [0, 55], [-48, 28], [-48, -28],
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-label="Nexus" role="img">
      <g transform="translate(100,100)" stroke="#fff">
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <line x1="0" y1="0" x2={x} y2={y} stroke="#93c5fd" strokeWidth="2" />
            <circle cx={x} cy={y} r="8" fill="#1d4ed8" strokeWidth="2" />
          </g>
        ))}
        <circle cx="0" cy="0" r="15" fill="#2563eb" strokeWidth="3" />
        <circle cx="0" cy="0" r="6" fill="#bfdbfe" stroke="none" />
      </g>
    </svg>
  );
}