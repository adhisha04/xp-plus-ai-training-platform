// ✅ simple cn replacement (no dependency needed)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const levelStyles = {
  beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  advanced: "bg-rose-100 text-rose-700 border-rose-200",
};

const levelXP = {
  beginner: 20,
  intermediate: 35,
  advanced: 50,
};

export default function LevelBadge({
  level = "beginner",
  showXP = false,
  size = "default",
}) {
  const sizeClasses =
    size === "small"
      ? "px-2 py-0.5 text-xs"
      : "px-3 py-1 text-sm";

  const safeLevel = level?.toLowerCase?.() || "beginner";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border capitalize",
        levelStyles[safeLevel] || levelStyles.beginner,
        sizeClasses
      )}
    >
      {/* Capitalized label */}
      {safeLevel.charAt(0).toUpperCase() + safeLevel.slice(1)}

      {showXP && (
        <span className="opacity-75">
          +{levelXP[safeLevel] || 20} XP
        </span>
      )}
    </span>
  );
}