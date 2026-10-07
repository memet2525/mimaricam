import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Yükleniyor...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-[#C58B38]" />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};
