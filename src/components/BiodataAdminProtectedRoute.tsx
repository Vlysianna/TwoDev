import React from 'react';
import { useBiodataAdminCheck } from '@/hooks/useBiodataAdminCheck';

interface BiodataAdminProtectedRouteProps {
  children: React.ReactNode;
}

const BiodataAdminProtectedRoute: React.FC<BiodataAdminProtectedRouteProps> = ({ children }) => {
  const { isCheckingBiodata } = useBiodataAdminCheck();

  if (isCheckingBiodata) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa kelengkapan biodata admin...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default BiodataAdminProtectedRoute;