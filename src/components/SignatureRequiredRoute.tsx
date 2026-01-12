import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/helper/axios';
import paths from '@/routes/paths';

interface SignatureRequiredRouteProps {
    children: React.ReactNode;
}

const SignatureRequiredRoute: React.FC<SignatureRequiredRouteProps> = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const [isCheckingSignature, setIsCheckingSignature] = useState(true);
    const [hasSignature, setHasSignature] = useState<boolean | null>(null);

    const isProfilePage = location.pathname === paths.admin.profile || location.pathname === paths.asesor.profile;
    const isBiodataPage = location.pathname.includes('/biodata');
    const isAuthPage = location.pathname.includes('/auth/');
    const isPublicPage = location.pathname.includes('/public/');
    const shouldSkipCheck = isProfilePage || isBiodataPage || isAuthPage || isPublicPage;

    const getProfilePath = (roleId: number): string => {
        switch (roleId) {
            case 1:
                return paths.admin.profile;
            case 2:
                return paths.asesor.profile;
            default:
                return '/';
        }
    };

    useEffect(() => {
        const isProfilePage = location.pathname === paths.admin.profile || location.pathname === paths.asesor.profile;
        const isBiodataPage = location.pathname.includes('/biodata');
        const isAuthPage = location.pathname.includes('/auth/');
        const isPublicPage = location.pathname.includes('/public/');
        const shouldSkip = isProfilePage || isBiodataPage || isAuthPage || isPublicPage;

        setHasSignature(null);
        setIsCheckingSignature(true);

        if (shouldSkip) {
            setHasSignature(true);
            setIsCheckingSignature(false);
            return;
        }

        if (!isAuthenticated || !user || isLoading) {
            return;
        }

        if (user.role_id !== 1 && user.role_id !== 2) {
            setHasSignature(true);
            setIsCheckingSignature(false);
            return;
        }

        const checkSignature = async () => {
            setIsCheckingSignature(true);
            try {
                const response = await api.get(`/auth/me?t=${Date.now()}`);
                if (response.data?.success) {
                    const signature = response.data.data?.signature;
                    const signatureExists = !!(signature && typeof signature === 'string' && signature.trim().length > 0);
                    setHasSignature(signatureExists);
                } else {
                    setHasSignature(false);
                }
            } catch (error) {
                setHasSignature(false);
            } finally {
                setIsCheckingSignature(false);
            }
        };

        checkSignature();
    }, [user?.id, user?.role_id, isAuthenticated, isLoading, location.pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <>{children}</>;
    }

    if (user.role_id !== 1 && user.role_id !== 2) {
        return <>{children}</>;
    }
    if (shouldSkipCheck) {
        return <>{children}</>;
    }

    if (isCheckingSignature || hasSignature === null || hasSignature === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (hasSignature !== true) {
        const profilePath = getProfilePath(user.role_id);
        const shouldAddMessage = location.pathname !== profilePath;
        return (
            <Navigate
                to={profilePath}
                replace
                state={{
                    from: location.pathname,
                    ...(shouldAddMessage && { message: 'Harap upload tanda tangan terlebih dahulu untuk mengakses halaman ini.' })
                }}
            />
        );
    }

    // Only allow access if signature exists (hasSignature === true)
    return <>{children}</>;
};

export default SignatureRequiredRoute;
