interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
