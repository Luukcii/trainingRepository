// A gold ornament line: a jewel in the middle, scrolls on both sides.
// Only the left half is drawn; the right half is the same drawing flipped like a mirror.
function LeftHalf() {
  return (
    <>
      <path d="M186 20 H20" strokeWidth={1.5} />
      <path d="M186 20 C164 20 154 8 136 8 C118 8 116 26 129 26 C138 26 138 15 131 15" strokeWidth={2.5} />
      <path d="M140 20 C124 20 116 32 102 32 C90 32 90 20 98 20" strokeWidth={1.5} />
      <circle cx={20} cy={20} r={2.5} fill="url(#divider-gold)" stroke="none" />
      <circle cx={60} cy={20} r={1.8} fill="url(#divider-gold)" stroke="none" />
    </>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="divider-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="50%" stopColor="#d4a017" />
          <stop offset="100%" stopColor="#8a6508" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#divider-gold)" strokeLinecap="round">
        <LeftHalf />
        <g transform="translate(400 0) scale(-1 1)">
          <LeftHalf />
        </g>
      </g>
      {/* Center jewel: a gold diamond with a dark inset */}
      <path d="M200 6 L214 20 L200 34 L186 20 Z" fill="url(#divider-gold)" />
      <path d="M200 13 L207 20 L200 27 L193 20 Z" fill="#0c0a09" />
    </svg>
  );
}
