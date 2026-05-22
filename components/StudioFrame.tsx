import React from 'react';

interface StudioFrameProps {
  src: string;
  alt?: string;
  frame?: 'minimalist' | 'velvet' | 'marble' | 'glass' | 'wood' | 'none';
  reflection?: boolean;
  shadow?: boolean;
  scale?: number;
  className?: string;
  containerClassName?: string;
}

const StudioFrame: React.FC<StudioFrameProps> = ({
  src,
  alt = 'Product image',
  frame = 'none',
  reflection = true,
  shadow = true,
  scale = 100,
  className = '',
  containerClassName = ''
}) => {
  if (!frame || frame === 'none') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${containerClassName}`}>
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-contain ${className}`} 
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Define backdrop styles and effects based on frame choice
  const getFrameStyles = () => {
    switch (frame) {
      case 'minimalist':
        return {
          wrapper: 'bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-150',
          spotlight: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/60 blur-[60px] rounded-full',
          floor: 'bg-neutral-300/60 border-t border-neutral-100',
          shadowColor: 'bg-neutral-800/25',
          glow: 'absolute inset-0 bg-radial-[circle_at_center] from-white/30 to-transparent pointer-events-none',
          ambientOverlay: '',
        };
      case 'velvet':
        return {
          wrapper: 'bg-gradient-to-b from-neutral-950 via-slate-900 to-purple-950/80',
          spotlight: 'absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-fuchsia-600/10 blur-[80px] rounded-full',
          floor: 'bg-purple-950/20 border-t border-purple-900/30 backdrop-blur-sm',
          shadowColor: 'bg-black/80',
          glow: 'absolute inset-0 bg-radial-[circle_at_top] from-indigo-500/10 via-transparent to-transparent pointer-events-none',
          ambientOverlay: 'bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-950/30 via-transparent to-transparent opacity-80',
        };
      case 'marble':
        return {
          wrapper: 'bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-950',
          spotlight: 'absolute top-10 left-1/3 w-72 h-72 bg-amber-500/10 blur-[90px] rounded-full',
          floor: 'bg-neutral-950/80 border-t border-white/5 backdrop-blur-md',
          shadowColor: 'bg-black/90',
          glow: 'absolute inset-0 bg-radial-[circle_at_right] from-amber-400/5 to-transparent pointer-events-none',
          ambientOverlay: 'bg-gradient-to-tr from-stone-900/40 via-transparent to-amber-500/5',
        };
      case 'glass':
        return {
          wrapper: 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-cyan-950/50',
          spotlight: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full',
          floor: 'bg-cyan-950/30 border-t border-cyan-800/20 backdrop-blur-lg',
          shadowColor: 'bg-cyan-950/75',
          glow: 'absolute top-4 left-4 w-12 h-12 bg-cyan-400/10 blur-xl rounded-full',
          ambientOverlay: 'bg-gradient-to-b from-teal-500/5 to-transparent',
        };
      case 'wood':
        return {
          wrapper: 'bg-gradient-to-b from-[#3d2719] via-[#2d1b10] to-[#1a100a]',
          spotlight: 'absolute top-1/4 right-1/4 w-80 h-80 bg-orange-400/10 blur-[80px] rounded-full',
          floor: 'bg-[#180f0a] border-t border-orange-950/20',
          shadowColor: 'bg-[#000000]/70',
          glow: 'absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400/10 via-transparent to-transparent pointer-events-none',
          ambientOverlay: 'absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent',
        };
      default:
        return {
          wrapper: 'bg-neutral-100',
          spotlight: '',
          floor: 'bg-neutral-200',
          shadowColor: 'bg-neutral-600/30',
          glow: '',
          ambientOverlay: '',
        };
    }
  };

  const styles = getFrameStyles();
  const visualScale = scale / 100;

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col justify-end select-none rounded-3xl ${styles.wrapper} ${containerClassName}`}>
      {/* Light highlights & Backlighting */}
      <div className={styles.spotlight} />
      {styles.glow && <div className={styles.glow} />}
      {styles.ambientOverlay && <div className={`absolute inset-0 pointer-events-none ${styles.ambientOverlay}`} />}

      {/* Dynamic Floor Dividing perspective plane */}
      <div className={`absolute bottom-0 left-0 right-0 h-[28%] z-10 ${styles.floor}`} />

      {/* High-end foliage light leaf shadows (Wood/Minimalist specific) */}
      {(frame === 'wood' || frame === 'minimalist') && (
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
          <svg className="w-full h-full filter blur-[1px]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-10,-10 Q20,30 40,10 T80,40 T120,0" fill="transparent" stroke="#222" strokeWidth="8" strokeLinecap="round" />
            <path d="M5,40 Q35,80 60,60 T110,90" fill="transparent" stroke="#333" strokeWidth="12" strokeLinecap="round" />
            <circle cx="15" cy="50" r="1.5" fill="#111" />
            <circle cx="25" cy="45" r="2.5" fill="#111" />
            <circle cx="55" cy="65" r="3" fill="#111" />
          </svg>
        </div>
      )}

      {/* Foreground Main Stage Container */}
      <div className="relative w-full h-full z-20 flex flex-col items-center justify-end pb-[26%]">
        
        {/* Floating Product Image Container */}
        <div 
          className="relative transition-transform duration-500 flex items-center justify-center select-none"
          style={{ transform: `scale(${visualScale})` }}
        >
          {/* UNDER SHADOW: Soft dropped horizontal floor ellipse shadow */}
          {shadow && (
            <div className="absolute bottom-1 left-12 right-12 h-5 flex items-center justify-center opacity-85 pointer-events-none select-none blur-[4px]">
              <div className={`w-[85%] h-[70%] rounded-[50%] blur-sm filter transition-all ${styles.shadowColor}`} />
            </div>
          )}

          {/* Core Product Picture Asset */}
          <img
            src={src}
            alt={alt}
            className={`max-h-[160px] md:max-h-[190px] w-auto max-w-[85%] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] select-none ${className}`}
            referrerPolicy="no-referrer"
          />

          {/* UNDER GLOW accent ring backlight */}
          {frame === 'glass' && (
            <div className="absolute -inset-10 -z-10 bg-cyan-400/10 blur-3xl rounded-full" />
          )}
        </div>

        {/* PERSPECTIVE REFLECTION (Floor glass reflection effect) */}
        {reflection && (
          <div 
            className="absolute top-[75%] left-0 right-0 h-[22%] opacity-15 overflow-hidden flex justify-center pointer-events-none select-none select-none"
            style={{ 
              transform: `scale(${visualScale}) scaleY(-1) translateY(-1px)`,
              filter: 'blur(3px)'
            }}
          >
            <div className="relative flex justify-center w-full">
              {/* Reflected Image Fading Gradient overlay */}
              <img
                src={src}
                alt=""
                className="max-h-[160px] md:max-h-[190px] w-auto max-w-[85%] object-contain pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              {frame === 'minimalist' && (
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-200 via-transparent to-transparent" />
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default StudioFrame;
