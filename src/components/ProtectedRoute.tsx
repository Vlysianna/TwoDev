import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (requireAuth && isAuthenticated && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role_id)) {
      // Redirect based on user role
      switch (user.role_id) {
        case 1: // Admin
          return <Navigate to="/admin" replace />;
        case 2: // Assessor
          return <Navigate to="/asesor" replace />;
        case 3: // Assessee
          return <Navigate to="/asesi" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && location.pathname.startsWith('/auth')) {
    if (user) {
      switch (user.role_id) {
        case 1: // Admin
          return <Navigate to="/admin" replace />;
        case 2: // Assessor
          return <Navigate to="/asesor" replace />;
        case 3: // Assessee
          return <Navigate to="/asesi" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
