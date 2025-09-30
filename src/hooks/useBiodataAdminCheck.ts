import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import paths from '@/routes/paths';

interface AdminBiodata {
  id?: number;
  user_id?: number | string;
  user?: { id?: number | string };
  address?: string;
  phone_no?: string;
  birth_date?: string;
}

export const useBiodataAdminCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingBiodata, setIsCheckingBiodata] = useState(true);
  // biodataComplete is tri-state: null = unknown/loading, false = incomplete, true = complete
  const [biodataComplete, setBiodataComplete] = useState<boolean | null>(null);

  const checkBiodataCompleteness = (biodata: AdminBiodata | null): boolean => {
    if (!biodata) return false;
    // If a record exists for the user (user_id matches), consider biodata complete
    if (biodata.user_id && user && String(biodata.user_id) === String(user.id)) {
      return true;
    }
    // Fallback: ensure required fields are populated
    return (
      (biodata.address?.trim() ?? '') !== '' &&
      (biodata.phone_no?.trim() ?? '') !== '' &&
      (biodata.birth_date?.trim() ?? '') !== ''
    );
  };

  useEffect(() => {
    const checkBiodata = async () => {
      if (!user) {
        setIsCheckingBiodata(false);
        return;
      }
      setIsCheckingBiodata(true);
      let biodata: AdminBiodata | null = null;
      try {
        // The backend exposes GET /admins (list) and GET /admins/:id (admin id).
        // To find the admin record for the logged-in user we fetch the list
        // and match by user_id (backend stores admin.user_id = user.id).
        const resp = await api.get('/admins');
        if (resp.data?.success) {
          const list = resp.data.data;
          if (Array.isArray(list)) {
            const found = list.find((a: any) => String(a.user_id) === String(user.id) || (a.user && String(a.user.id) === String(user.id)));
            biodata = found || null;
          } else if (resp.data.data && (resp.data.data.user_id || resp.data.data.user)) {
            const d = resp.data.data;
            if (String(d.user_id) === String(user.id) || (d.user && String(d.user.id) === String(user.id))) {
              biodata = d;
            }
          }
        }
      } catch (error: any) {
        console.error('Error checking admin biodata:', error);
        biodata = null;
      }
  const isComplete = checkBiodataCompleteness(biodata);
  setBiodataComplete(isComplete);
      // Redirect if not complete and not on biodata page
      if (!isComplete && location.pathname !== paths.admin.biodata) {
        if (location.pathname.startsWith('/admin')) {
          navigate(paths.admin.biodata, {
            replace: true,
            state: {
              from: location.pathname,
              message: 'Harap lengkapi biodata admin terlebih dahulu untuk mengakses fitur admin.'
            }
          });
        }
      }
      setIsCheckingBiodata(false);
    };
    checkBiodata();
  }, [user, location.pathname, navigate]);

  const refreshBiodataCheck = async () => {
    if (!user) return;
    setIsCheckingBiodata(true);
    let biodata: AdminBiodata | null = null;
    try {
      const resp = await api.get('/admins');
      if (resp.data?.success) {
        const list = resp.data.data;
        if (Array.isArray(list)) {
          const found = list.find((a: any) => String(a.user_id) === String(user.id) || (a.user && String(a.user.id) === String(user.id)));
          biodata = found || null;
        } else if (resp.data.data) {
          const d = resp.data.data;
          if (String(d.user_id) === String(user.id) || (d.user && String(d.user.id) === String(user.id))) {
            biodata = d;
          }
        }
      }
    } catch (error: any) {
      console.error('Error refreshing admin biodata:', error);
      biodata = null;
    }
  setBiodataComplete(checkBiodataCompleteness(biodata));
    setIsCheckingBiodata(false);
  };

  return {
    isCheckingBiodata,
    biodataComplete,
    refreshBiodataCheck,
  };
};

export default useBiodataAdminCheck;