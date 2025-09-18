import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import paths from '@/routes/paths';

interface AssessorData {
  id: number;
  user_id: number;
  scheme_id: number;
  name: string; // backend returns 'name' not 'full_name'
  address: string;
  phone_no: string;
  birth_date: string;
  no_reg_met: string;
}

interface AssessorDetail {
  tax_id_number?: string;
  bank_book_cover?: string;
  certificate?: string;
  national_id?: string;
  birth_place?: string;
  address?: string;
  phone_no?: string;
  birth_date?: string;
}

export const useBiodataCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingBiodata, setIsCheckingBiodata] = useState(true);
  const [biodataComplete, setBiodataComplete] = useState(false);

  const checkBiodataCompleteness = (
    assessor: AssessorData | null,
    _assessorDetail: AssessorDetail | null
  ): boolean => {
    if (!assessor) return false;

    // Required fields from assessor table (based on actual backend response)
    const requiredAssessorFields = [
      assessor.address,
      assessor.phone_no,
      assessor.birth_date,
      assessor.no_reg_met,
    ];

    // Check if all required assessor fields are filled
    const assessorComplete = requiredAssessorFields.every(
      field => field && field.toString().trim() !== ''
    );

    // For basic functionality, just assessor data is enough
    return assessorComplete;
  };

  useEffect(() => {
    const checkBiodata = async () => {
      if (!user) {
        setIsCheckingBiodata(false);
        return;
      }
      setIsCheckingBiodata(true);

      console.log("Tes");
      try {
        // Get assessor by user id
        let assessor: AssessorData | null = null;
        let assessorDetail: AssessorDetail | null = null;

        try {
          const assessorResp = await api.get(`/assessor/user/${user.id}`);
          if (assessorResp.data?.success) {
            assessor = assessorResp.data.data;

            // Try to get assessor detail
            if (assessor) {
              try {
                const detailResp = await api.get(`/assessor-detail/${assessor.id}`);
                if (detailResp.data?.success) {
                  assessorDetail = detailResp.data.data;
                }
              } catch {
                // Detail not found, that's okay
              }
            }
          }
        } catch (error: any) {
          // If 404, it means assessor doesn't exist yet - this is normal for new users
          if (error.response?.status === 404) {
            assessor = null;
            assessorDetail = null;
          } else {
            throw error; // Re-throw other errors
          }
        }

        console.log("Assessor", assessor);
        console.log("Detail", assessorDetail);

        const isComplete = checkBiodataCompleteness(assessor, assessorDetail);
        setBiodataComplete(isComplete);

        // If biodata is not complete and user is not already on biodata page, redirect
        if (!isComplete && location.pathname !== paths.asesor.biodata) {
          // Only redirect if user is trying to access asesor routes (not auth or public pages)
          if (location.pathname.startsWith('/asesor')) {
            const targetRoute = location.pathname;
            let message = 'Harap lengkapi biodata terlebih dahulu untuk melanjutkan.';
            
            // Customize message based on target route
            if (targetRoute.includes('dashboard')) {
              message = 'Akses Dashboard memerlukan biodata yang lengkap. Silakan lengkapi biodata terlebih dahulu.';
            } else if (targetRoute.includes('assessment')) {
              message = 'Akses fitur Assessment memerlukan biodata yang lengkap. Silakan lengkapi biodata terlebih dahulu.';
            } else if (targetRoute.includes('recap')) {
              message = 'Akses Recap Assessment memerlukan biodata yang lengkap. Silakan lengkapi biodata terlebih dahulu.';
            }
            
            navigate(paths.asesor.biodata, { 
              replace: true,
              state: { 
                from: location.pathname,
                message: message
              }
            });
          }
        }
      } catch (error) {
        console.error('Error checking biodata:', error);
        // If error occurs, allow access but set biodata as incomplete
        // setBiodataComplete(false);
      } finally {
        setIsCheckingBiodata(false);
      }
    };

    checkBiodata();
  }, [user, navigate, location.pathname]);

  const refreshBiodataCheck = async () => {
    if (!user) return;
    
    setIsCheckingBiodata(true);
    try {
      // Get assessor by user id
      let assessor: AssessorData | null = null;
      let assessorDetail: AssessorDetail | null = null;

      try {
        const assessorResp = await api.get(`/assessor/user/${user.id}`);
        if (assessorResp.data?.success) {
          assessor = assessorResp.data.data;

          // Try to get assessor detail
          if (assessor) {
            try {
              const detailResp = await api.get(`/assessor-detail/${assessor.id}`);
              if (detailResp.data?.success) {
                assessorDetail = detailResp.data.data;
              }
            } catch {
              // Detail not found, that's okay
            }
          }
        }
      } catch (error: any) {
        // If 404, it means assessor doesn't exist yet - this is normal for new users
        if (error.response?.status === 404) {
          assessor = null;
          assessorDetail = null;
        } else {
          throw error; // Re-throw other errors
        }
      }

      const isComplete = checkBiodataCompleteness(assessor, assessorDetail);
      setBiodataComplete(isComplete);
    } catch (error) {
      console.error('Error refreshing biodata:', error);
      setBiodataComplete(false);
    } finally {
      setIsCheckingBiodata(false);
    }
  };

  return {
    isCheckingBiodata,
    biodataComplete,
    refreshBiodataCheck,
  };
};

export default useBiodataCheck;