export default function SessionCard({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-800">{title}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>
      {meta && <div className="text-sm text-gray-600">{meta}</div>}
    </div>
  );
}