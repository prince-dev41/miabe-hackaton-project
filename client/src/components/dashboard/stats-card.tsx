import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  percentageChange?: number;
  period?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  percentageChange,
  period = "last month",
}: StatsCardProps) {
  const isPositive = percentageChange !== undefined ? percentageChange >= 0 : undefined;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <span className={`${iconBgColor} p-2 rounded-full`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {percentageChange !== undefined && (
        <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} mt-2 flex items-center`}>
          {isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {Math.abs(percentageChange)}% since {period}
        </p>
      )}
    </div>
  );
}
