import React from 'react';

export default function WatercolorEffect() {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Paper Grain Effect */}
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.04" 
            numOctaves="4" 
            result="noise" 
          />
          <feColorMatrix 
            type="matrix" 
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" 
            result="matrix" 
          />
          <feComposite 
            in="SourceGraphic" 
            in2="matrix" 
            operator="over" 
          />
        </filter>

        {/* Hand-Drawn Sketch Filter */}
        <filter id="sketch-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015" 
            numOctaves="3" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="4" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>

        {/* Soft Bleed Watercolor Filter */}
        <filter id="watercolor-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.008" 
            numOctaves="5" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="18" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="blur" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export function SplatterDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
      {/* Hand-drawn ink splotches */}
      <div 
        className="absolute top-12 left-[15%] w-16 h-16 rounded-full bg-amber-400 blur-xl mix-blend-multiply"
        style={{ transform: 'rotate(25deg) scaleX(1.3)' }}
      />
      <div 
        className="absolute bottom-16 right-[20%] w-24 h-24 rounded-full bg-blue-300 blur-2xl mix-blend-multiply"
        style={{ transform: 'rotate(-15deg)' }}
      />
      <div 
        className="absolute top-1/2 left-[40%] w-28 h-20 rounded-full bg-rose-200 blur-3xl mix-blend-multiply"
      />
    </div>
  );
}
