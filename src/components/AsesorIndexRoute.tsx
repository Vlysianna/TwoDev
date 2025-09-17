import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiodataCheck } from '@/hooks/useBiodataCheck';
import paths from '@/routes/paths';

const AsesorIndexRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isCheckingBiodata, biodataComplete } = useBiodataCheck();

  useEffect(() => {
    if (!isCheckingBiodata) {
      if (biodataComplete) {
        // If biodata is complete, redirect to dashboard
        navigate(paths.asesor.dashboardAsesor, { replace: true });
      } else {
        // If biodata is incomplete, redirect to biodata page
        navigate(paths.asesor.biodata, { 
          replace: true,
          state: { 
            message: 'Selamat datang! Harap lengkapi biodata Anda untuk mengakses semua fitur asesor.' 
          }
        });
      }
    }
  }, [isCheckingBiodata, biodataComplete, navigate]);

  // Show loading while checking biodata
  if (isCheckingBiodata) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa status asesor...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AsesorIndexRoute;