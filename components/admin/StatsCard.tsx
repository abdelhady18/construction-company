interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-muted">{title}</p>
        <p className="text-2xl font-bold text-heading">{value}</p>
      </div>
    </div>
  );
}
