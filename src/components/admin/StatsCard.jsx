export default function StatsCard({
  label,
  value,
  icon: Icon,
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
    red: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-3.5 sm:p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">{label}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--foreground)] mt-1 break-words">
            {value}
          </p>
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl ${colors[color]} shrink-0`}>
          <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>
      </div>
    </div>
  );
}
