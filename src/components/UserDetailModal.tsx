import React from 'react';
import { X, User, Mail, Calendar, MapPin, Phone, IdCard, GraduationCap } from 'lucide-react';

interface Role {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
  updated_at: string;
  assessee?: {
    id: number;
    full_name: string;
    phone_no: string;
    identity_number: string;
    birth_date: string;
    birth_location: string;
    gender: string;
    nationality: string;
    house_phone_no?: string;
    office_phone_no?: string;
    address: string;
    postal_code?: string;
    educational_qualifications: string;
  };
  assessor?: {
    id: number;
    full_name: string;
    phone_no: string;
    scheme_id: number;
    address: string;
    birth_date: string;
  };
  admin?: {
    id: number;
    address: string;
    phone_no: string;
    birth_date: string;
  };
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  if (!isOpen) return null;

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'Admin': 'Administrator',
      'Assessor': 'Asesor',
      'Assessee': 'Asesi'
    };
    return roleMap[roleName] || roleName;
  };

  const getRoleColor = (roleName: string) => {
    const colorMap: { [key: string]: string } = {
      'Admin': 'bg-red-100 text-red-800',
      'Assessor': 'bg-blue-100 text-blue-800',
      'Assessee': 'bg-green-100 text-green-800'
    };
    return colorMap[roleName] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const getUserDisplayName = () => {
    if (user.assessee?.full_name) return user.assessee.full_name;
    if (user.assessor?.full_name) return user.assessor.full_name;
    return user.full_name;
  };

  const renderUserSpecificInfo = () => {
    if (user.role.name === 'Assessee' && user.assessee) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Informasi Asesi
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <IdCard className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">NIK</p>
                <p className="text-sm text-gray-900">{user.assessee.identity_number || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">No. Telepon</p>
                <p className="text-sm text-gray-900">{user.assessee.phone_no || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tanggal Lahir</p>
                <p className="text-sm text-gray-900">
                  {user.assessee.birth_date ? formatDate(user.assessee.birth_date) : '-'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tempat Lahir</p>
                <p className="text-sm text-gray-900">{user.assessee.birth_location || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Jenis Kelamin</p>
                <p className="text-sm text-gray-900">
                  {user.assessee.gender === 'male' ? 'Laki-laki' : user.assessee.gender === 'female' ? 'Perempuan' : '-'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <IdCard className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Kewarganegaraan</p>
                <p className="text-sm text-gray-900">{user.assessee.nationality || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Alamat</p>
              <p className="text-sm text-gray-900">{user.assessee.address || '-'}</p>
            </div>
          </div>
          
          {user.assessee.educational_qualifications && (
            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Kualifikasi Pendidikan</p>
                <p className="text-sm text-gray-900">{user.assessee.educational_qualifications}</p>
              </div>
            </div>
          )}
          
          {(user.assessee.house_phone_no || user.assessee.office_phone_no) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.assessee.house_phone_no && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telepon Rumah</p>
                    <p className="text-sm text-gray-900">{user.assessee.house_phone_no}</p>
                  </div>
                </div>
              )}
              
              {user.assessee.office_phone_no && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telepon Kantor</p>
                    <p className="text-sm text-gray-900">{user.assessee.office_phone_no}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    if (user.role.name === 'Assessor' && user.assessor) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Informasi Asesor
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">No. Telepon</p>
                <p className="text-sm text-gray-900">{user.assessor.phone_no || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tanggal Lahir</p>
                <p className="text-sm text-gray-900">
                  {user.assessor.birth_date ? formatDate(user.assessor.birth_date) : '-'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <IdCard className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">ID Skema</p>
                <p className="text-sm text-gray-900">{user.assessor.scheme_id || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Alamat</p>
              <p className="text-sm text-gray-900">{user.assessor.address || '-'}</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (user.role.name === 'Admin' && user.admin) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Informasi Administrator
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">No. Telepon</p>
                <p className="text-sm text-gray-900">{user.admin.phone_no || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tanggal Lahir</p>
                <p className="text-sm text-gray-900">
                  {user.admin.birth_date ? formatDate(user.admin.birth_date) : '-'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Alamat</p>
              <p className="text-sm text-gray-900">{user.admin.address || '-'}</p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E77D35] rounded-full flex items-center justify-center text-white text-lg font-medium">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Detail Pengguna
              </h2>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informasi Dasar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Nama Lengkap</p>
                  <p className="text-sm text-gray-900">{getUserDisplayName()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <IdCard className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Role</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role.name)}`}>
                    {getRoleDisplayName(user.role.name)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Terdaftar</p>
                  <p className="text-sm text-gray-900">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>
            
            {user.updated_at !== user.created_at && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Terakhir Diperbarui</p>
                  <p className="text-sm text-gray-900">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Role-specific Information */}
          {renderUserSpecificInfo()}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;