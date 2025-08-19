import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card'; // Use your existing card component

interface StatGroupProps {
  title: string;
  children: React.ReactNode;
}

export const StatGroup = ({ title, children }: StatGroupProps) => {
  return (
    <Card className="rounded-2xl border-none shadow-lg dark:bg-gray-800/50">
      <CardContent className="p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};