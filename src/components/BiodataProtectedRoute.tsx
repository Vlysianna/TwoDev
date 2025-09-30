import React from 'react';
import { useBiodataCheck } from '@/hooks/useBiodataCheck';

interface BiodataProtectedRouteProps {
  children: React.ReactNode;
}

const BiodataProtectedRoute: React.FC<BiodataProtectedRouteProps> = ({ children }) => {
  const { isCheckingBiodata, biodataComplete } = useBiodataCheck();

  // Show loading while checking biodata
  if (isCheckingBiodata) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa kelengkapan biodata...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default BiodataProtectedRoute;