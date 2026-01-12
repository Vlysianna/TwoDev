import { useState, useEffect } from 'react';
import api from '@/helper/axios';

interface UseSignatureCheckReturn {
  hasSignature: boolean | null;
  isChecking: boolean;
  checkSignature: () => Promise<void>;
}

export const useSignatureCheck = (): UseSignatureCheckReturn => {
  const [hasSignature, setHasSignature] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkSignature = async () => {
    setIsChecking(true);
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success) {
        const userData = response.data.data;
        const roleId = userData.role_id;
        const signature = userData.signature;

        if (roleId === 1 || roleId === 2) {
          const signatureExists = signature && signature.trim() !== '';
          setHasSignature(signatureExists);
        } else {
          setHasSignature(true);
        }
      } else {
        setHasSignature(true);
      }
    } catch (error) {
      console.error('Error checking signature:', error);
      setHasSignature(true);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    hasSignature,
    isChecking,
    checkSignature,
  };
};
