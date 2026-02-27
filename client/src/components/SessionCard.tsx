export default function SessionCard({
  title,
  subtitle,
  meta,
  action,
}: {
  title: string;
  subtitle?: React.ReactNode;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-gray-800 truncate">{title}</div>
          {subtitle && <div className="text-sm text-gray-500 truncate">{subtitle}</div>}
        </div>
        {meta && <div className="text-sm text-gray-600 ml-4 flex-shrink-0">{meta}</div>}
      </div>
      {action && <div className="w-full">{action}</div>}
    </div>
  );
}