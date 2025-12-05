interface WavyLineIconProps {
  className?: string;
  variant?: 'top' | 'bottom';
}

export default function WavyLineIcon({
  className = '',
  variant = 'top',
}: WavyLineIconProps) {
  const topPath = 'M0,0 L0,60 Q200,100 400,60 T800,60 T1200,60 L1200,0 Z';
  const bottomPath = 'M400,120 L400,60 Q600,20 800,60 T1200,60 L1200,120 Z';

  return (
    <svg
      className={className}
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d={variant === 'top' ? topPath : bottomPath}
        fill="currentColor"
      />
    </svg>
  );
}

