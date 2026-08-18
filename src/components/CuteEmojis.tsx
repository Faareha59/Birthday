import React from 'react';
import { motion } from 'motion/react';

// Cute Kawaii Cake Emoji with warm bakery doodle styling, whipped cream & party sprinkles
export const CuteCakeEmoji: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-xs"
      >
        {/* Candle stick */}
        <rect x="29" y="8" width="6" height="14" rx="2" fill="#74B9FF" stroke="#2C221A" strokeWidth="2" />
        <line x1="30" y1="11" x2="34" y2="13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="16" x2="34" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Candle Flame */}
        <motion.path
          d="M32 1C32 1 37 5 37 8C37 10.76 34.76 13 32 13C29.24 13 27 10.76 27 8C27 5 32 1 32 1Z"
          fill="#FFEAA7"
          stroke="#F39C12"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.15, 0.95, 1], y: [0, -1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
        <circle cx="32" cy="8" r="2" fill="#E17055" />

        {/* Whipped Cream Dollops on Top */}
        <ellipse cx="18" cy="22" rx="5" ry="4" fill="#FFFFFF" stroke="#2C221A" strokeWidth="1.5" />
        <ellipse cx="46" cy="22" rx="5" ry="4" fill="#FFFFFF" stroke="#2C221A" strokeWidth="1.5" />

        {/* Top Cake Tier - Warm Golden Vanilla */}
        <rect x="10" y="24" width="44" height="16" rx="8" fill="#FFEAA7" stroke="#2C221A" strokeWidth="2.5" />
        {/* Caramel / Chocolate Frosting Drips */}
        <path
          d="M10 28C14 32 18 30 22 33C26 30 30 33 34 30C38 33 42 30 46 33C50 30 54 28 54 28"
          stroke="#E17055"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Bottom Cake Tier */}
        <rect x="6" y="38" width="52" height="20" rx="9" fill="#FFF5EB" stroke="#2C221A" strokeWidth="2.5" />
        {/* Honey Cream Ribbon */}
        <path
          d="M6 44C12 47 18 45 24 48C30 45 36 48 42 45C48 48 54 44 58 44"
          stroke="#FDCB6E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Elegant Gold Pearl Accents */}
        <circle cx="20" cy="50" r="2" fill="#D4AF37" />
        <circle cx="32" cy="50" r="2" fill="#D4AF37" />
        <circle cx="44" cy="50" r="2" fill="#D4AF37" />

        {/* Cake Plate */}
        <ellipse cx="32" cy="59" rx="30" ry="3.5" fill="#DFE6E9" stroke="#2C221A" strokeWidth="2" />
      </svg>
    </motion.span>
  );
};

// Cute Girlish Pastel Ribbon Bow Emoji
export const CuteBowEmoji: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 28,
  className = '',
  color = '#FF7675',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      whileHover={{ scale: 1.25, rotate: [-10, 10, 0] }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Left Bow Loop */}
        <path
          d="M30 30C16 18 10 38 28 36Z"
          fill={color}
          stroke="#2C221A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M22 28C18 31 18 33 22 34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Bow Loop */}
        <path
          d="M34 30C48 18 54 38 36 36Z"
          fill={color}
          stroke="#2C221A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M42 28C46 31 46 33 42 34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Ribbon Tails */}
        <path
          d="M28 36L18 54L26 50L30 38"
          fill={color}
          stroke="#2C221A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M36 36L46 54L38 50L34 38"
          fill={color}
          stroke="#2C221A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Center Knot with Pearl / Gem */}
        <ellipse cx="32" cy="33" rx="4.5" ry="4" fill="#FFEAA7" stroke="#2C221A" strokeWidth="2.5" />
        <circle cx="31" cy="32" r="1.5" fill="#FFFFFF" />
      </svg>
    </motion.span>
  );
};

// Cute Kawaii Gift Box Emoji
export const CuteGiftEmoji: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      whileHover={{ scale: 1.25, rotate: [-6, 6, 0] }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ribbon Loops */}
        <path
          d="M24 16C18 8 28 4 32 16C36 4 46 8 40 16"
          fill="#FF7675"
          stroke="#2C221A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="16" r="3.5" fill="#FFEAA7" stroke="#2C221A" strokeWidth="2" />

        {/* Box Lid */}
        <rect x="10" y="16" width="44" height="12" rx="4" fill="#55EFC4" stroke="#2C221A" strokeWidth="2.5" />
        {/* Lid Ribbon */}
        <rect x="28" y="16" width="8" height="12" fill="#FF7675" stroke="#2C221A" strokeWidth="2" />

        {/* Box Body */}
        <rect x="13" y="27" width="38" height="30" rx="5" fill="#81ECEC" stroke="#2C221A" strokeWidth="2.5" />
        {/* Body Ribbon */}
        <rect x="28" y="27" width="8" height="30" fill="#FF7675" stroke="#2C221A" strokeWidth="2" />

        {/* Kawaii Face */}
        <circle cx="21" cy="38" r="2" fill="#2C221A" />
        <circle cx="43" cy="38" r="2" fill="#2C221A" />
        <ellipse cx="19" cy="42" rx="2.5" ry="1.5" fill="#FF7675" opacity="0.7" />
        <ellipse cx="45" cy="42" rx="2.5" ry="1.5" fill="#FF7675" opacity="0.7" />
        <path d="M30 42C32 44 34 42 34 42" stroke="#2C221A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.span>
  );
};

// Cute Kawaii Single Balloon Emoji with smiling face & string
export const CuteBalloonEmoji: React.FC<{
  size?: number;
  className?: string;
  color?: string;
}> = ({ size = 28, className = '', color = '#FF7675' }) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      animate={{
        y: [0, -5, 0],
        rotate: [-3, 3, -3],
      }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      style={{ width: size, height: size * 1.25 }}
    >
      <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Balloon Body */}
        <ellipse cx="32" cy="28" rx="22" ry="26" fill={color} stroke="#2C221A" strokeWidth="2.5" />
        
        {/* Balloon Knot */}
        <path d="M28 54L36 54L34 58L30 58Z" fill={color} stroke="#2C221A" strokeWidth="2" />

        {/* Highlight Glint */}
        <ellipse cx="22" cy="18" rx="5" ry="8" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 22 18)" />

        {/* Kawaii Face */}
        <circle cx="25" cy="30" r="2" fill="#2C221A" />
        <circle cx="39" cy="30" r="2" fill="#2C221A" />
        <ellipse cx="20" cy="34" rx="2.5" ry="1.5" fill="#FFEAA7" opacity="0.8" />
        <ellipse cx="44" cy="34" rx="2.5" ry="1.5" fill="#FFEAA7" opacity="0.8" />
        <path d="M30 34C32 36 34 34 34 34" stroke="#2C221A" strokeWidth="2" strokeLinecap="round" />

        {/* Balloon String */}
        <path
          d="M32 58C31 64 35 68 32 74C30 78 33 80 32 80"
          stroke="#7A6452"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.span>
  );
};

// Cute Kawaii Multi-Balloon Cluster (Trio of colorful balloons)
export const CuteBalloonClusterEmoji: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      animate={{
        y: [0, -6, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
      style={{ width: size, height: size * 1.25 }}
    >
      <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Left Balloon (Sky Blue) */}
        <g>
          <ellipse cx="24" cy="32" rx="18" ry="22" fill="#74B9FF" stroke="#2C221A" strokeWidth="2" />
          <path d="M21 54L27 54L25 57L23 57Z" fill="#74B9FF" stroke="#2C221A" strokeWidth="1.5" />
          <ellipse cx="16" cy="24" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 16 24)" />
          {/* Face */}
          <circle cx="19" cy="34" r="1.5" fill="#2C221A" />
          <circle cx="29" cy="34" r="1.5" fill="#2C221A" />
          <path d="M23 37C24 38 25 37 25 37" stroke="#2C221A" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right Balloon (Sunny Yellow) */}
        <g>
          <ellipse cx="56" cy="34" rx="18" ry="22" fill="#FDCB6E" stroke="#2C221A" strokeWidth="2" />
          <path d="M53 56L59 56L57 59L55 59Z" fill="#FDCB6E" stroke="#2C221A" strokeWidth="1.5" />
          <ellipse cx="48" cy="26" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 48 26)" />
          {/* Face */}
          <circle cx="51" cy="36" r="1.5" fill="#2C221A" />
          <circle cx="61" cy="36" r="1.5" fill="#2C221A" />
          <path d="M55 39C56 40 57 39 57 39" stroke="#2C221A" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Center Main Balloon (Warm Coral Pink) */}
        <g>
          <ellipse cx="40" cy="26" rx="20" ry="24" fill="#FF7675" stroke="#2C221A" strokeWidth="2.5" />
          <path d="M37 50L43 50L41 53L39 53Z" fill="#FF7675" stroke="#2C221A" strokeWidth="2" />
          <ellipse cx="31" cy="18" rx="4" ry="7" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 31 18)" />
          {/* Face */}
          <circle cx="34" cy="27" r="1.8" fill="#2C221A" />
          <circle cx="46" cy="27" r="1.8" fill="#2C221A" />
          <ellipse cx="30" cy="30" rx="2" ry="1.2" fill="#FFEAA7" opacity="0.9" />
          <ellipse cx="50" cy="30" rx="2" ry="1.2" fill="#FFEAA7" opacity="0.9" />
          <path d="M38 30C40 32 42 30 42 30" stroke="#2C221A" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Tied Ribbon Knot & Strings */}
        <path d="M24 57C32 68 38 72 40 76" stroke="#7A6452" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M56 59C48 68 42 72 40 76" stroke="#7A6452" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M40 53L40 76" stroke="#7A6452" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Ribbon Bow */}
        <circle cx="40" cy="76" r="3" fill="#E17055" stroke="#2C221A" strokeWidth="1.5" />
        <path d="M40 78C38 84 42 90 39 96" stroke="#7A6452" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    </motion.span>
  );
};

// Cute Kawaii Sparkle Emoji
export const CuteSparkleEmoji: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      animate={{ rotate: [0, 90, 180, 270, 360], scale: [0.9, 1.2, 0.9] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M32 4C32 4 33 24 44 32C33 40 32 60 32 60C32 60 31 40 20 32C31 24 32 4 32 4Z"
          fill="#FFEAA7"
          stroke="#F39C12"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="4" fill="#FF7675" />
      </svg>
    </motion.span>
  );
};

// Cute Kawaii Party Popper Emoji
export const CutePartyEmoji: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <motion.span
      className={`inline-flex items-center justify-center align-middle ${className}`}
      whileHover={{ scale: 1.25, rotate: [0, -15, 15, 0] }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Cone */}
        <path d="M12 52L24 16L52 44L12 52Z" fill="#FDCB6E" stroke="#2C221A" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Stripes */}
        <path d="M18 36L38 48" stroke="#FF7675" strokeWidth="3" />
        <path d="M22 24L48 40" stroke="#74B9FF" strokeWidth="3" />
        {/* Confetti pieces */}
        <circle cx="38" cy="14" r="3" fill="#FF7675" />
        <circle cx="48" cy="20" r="2.5" fill="#55EFC4" />
        <circle cx="56" cy="30" r="3" fill="#A29BFE" />
        <path d="M42 6L46 10" stroke="#F1C40F" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M52 10L56 6" stroke="#E84393" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </motion.span>
  );
};
