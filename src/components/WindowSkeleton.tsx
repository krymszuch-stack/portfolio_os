import React from 'react';

export const WindowSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 animate-pulse bg-slate-50/50">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-200 rounded" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-4 w-[90%] bg-slate-200 rounded" />
      <div className="h-4 w-[95%] bg-slate-200 rounded" />
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="h-24 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};
