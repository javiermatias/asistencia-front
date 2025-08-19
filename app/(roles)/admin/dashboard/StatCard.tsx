import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ElementType;
  colorClasses: {
    background: string; // e.g., 'bg-blue-100 dark:bg-blue-900/50'
    text: string;       // e.g., 'text-blue-600 dark:text-blue-400'
  };
}

export const StatCard = ({ title, value, icon: Icon, colorClasses }: StatCardProps) => {
  return (
    <div className="transform rounded-2xl bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${colorClasses.background}`}>
          <Icon className={`h-6 w-6 ${colorClasses.text}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};