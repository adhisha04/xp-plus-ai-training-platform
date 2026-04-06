import { motion } from "framer-motion";

const LEVELS = [
  { level: 1, name: "Beginner", minXP: 0, maxXP: 100 },
  { level: 2, name: "Explorer", minXP: 100, maxXP: 300 },
  { level: 3, name: "Improver", minXP: 300, maxXP: 600 },
  { level: 4, name: "Skilled", minXP: 600, maxXP: 1000 },
  { level: 5, name: "XP Master", minXP: 1000, maxXP: Infinity },
];

export function getLevelInfo(totalXP) {
  const currentLevel =
    LEVELS.find((l) => totalXP >= l.minXP && totalXP < l.maxXP) ||
    LEVELS[LEVELS.length - 1];

  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentIndex + 1] || currentLevel;

  const xpInCurrentLevel = totalXP - currentLevel.minXP;
  const xpNeededForNext =
    currentLevel.maxXP === Infinity
      ? 0
      : currentLevel.maxXP - currentLevel.minXP;

  let progress =
    xpNeededForNext > 0
      ? (xpInCurrentLevel / xpNeededForNext) * 100
      : 100;

  // clamp between 0–100
  progress = Math.min(Math.max(progress, 0), 100);

  return {
    ...currentLevel,
    nextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
    progress,
    xpToNext:
      currentLevel.maxXP === Infinity
        ? 0
        : currentLevel.maxXP - totalXP,
  };
}

export default function XPProgressRing({
  totalXP = 0,
  size = 180,
  strokeWidth = 12,
}) {
  const levelInfo = getLevelInfo(totalXP);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (levelInfo.progress / 100) * circumference;

  // unique gradient id (prevents conflicts)
  const gradientId = `gradient-${size}-${strokeWidth}`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Gradient */}
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="#3A7BFF" />
            <stop offset="100%" stopColor="#23C4C7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {totalXP}
        </motion.span>

        <span className="text-sm text-gray-500 font-medium">
          XP
        </span>
      </div>
    </div>
  );
}