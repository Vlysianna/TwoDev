import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, Users } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Administrator';
      case 2:
        return 'Asesor';
      case 3:
        return 'Asesi';
      default:
        return 'Unknown';
    }
  };

  const getRoleIcon = (roleId: number) => {
    switch (roleId) {
      case 1:
        return <Shield className="w-8 h-8 text-blue-500" />;
      case 2:
        return <Users className="w-8 h-8 text-green-500" />;
      case 3:
        return <User className="w-8 h-8 text-orange-500" />;
      default:
        return <User className="w-8 h-8 text-gray-500" />;
    }
  };

  const getDashboardRoute = (roleId: number) => {
    switch (roleId) {
      case 1:
        return '/admin';
      case 2:
        return '/asesor';
      case 3:
        return '/asesi';
      default:
        return '/';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getRoleIcon(user.role_id)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Selamat Datang!
                </h1>
                <p className="text-gray-600">
                  Role: {getRoleName(user.role_id)}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Akun
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {getRoleName(user.role_id)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={getDashboardRoute(user.role_id)}
              className="block p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                {getRoleIcon(user.role_id)}
                <div>
                  <h3 className="font-medium text-gray-900">Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Go to {getRoleName(user.role_id)} dashboard
                  </p>
                </div>
              </div>
            </a>
            
            <a
              href="/"
              className="block p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  🏠
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Home</h3>
                  <p className="text-sm text-gray-600">
                    Return to homepage
                  </p>
                </div>
              </div>
            </a>

            <div className="block p-4 border rounded-lg opacity-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  ⚙️
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
