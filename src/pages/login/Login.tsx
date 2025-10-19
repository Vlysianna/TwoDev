import { useState, useEffect } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { getAssetPath } from '@/utils/assetPath';
import api from '@/helper/axios';
import useToast from '@/components/ui/useToast';

type FormValues = {
  email: string
  password: string
}

export default function LoginForm() {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }, // isSubmitting = loading state bawaan
  } = useForm<FormValues>()

  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname || '/';

  // Handle success message and pre-fill email from registration
  useEffect(() => {
    if (location.state?.message) {
      toast.show({
        description: location.state.message,
        type: 'success',
      });
    }
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const onSubmit = async (data: FormValues) => {

    const { email, password } = data;

    if (!email || !password) {
      toast.show({
        description: 'Email dan password harus diisi',
        type: 'error',
      })
      return;
    }

    await login(email, password).then(async () => {
      toast.show({
        description: 'Login berhasil',
        type: 'success',
      })
      // Get user info to check role
      try {
        const response = await api.get('/auth/me');
        const userRole = response.data.data.role_id;

        // For asesor users, always redirect to asesor root to ensure biodata check
        if (userRole === 2 && from.startsWith('/asesor') && from !== '/asesor') {
          navigate('/asesor', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If can't get user info, use default redirect
        // toast.show({
        //   description: 'Login gagal atau terjadi kesalahan',
        //   type: 'error',
        // })
        navigate(from, { replace: true });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err: any) => {
      // console.log(err);
      const errorMessage = err.message || 'Terjadi kesalahan';
      toast.show({
        description: errorMessage,
        type: 'error',
      })
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="rounded-lg p-6 md:p-8 w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-start">
            <div className="w-30 h-30 md:w-40 md:h-40 rounded-lg text-start">
              <img src={getAssetPath('/img/logo-lsp-oren.svg')} alt="Logo" className="w-full h-full" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Masuk</h1>
            <p className="mb-5 text-gray-600 text-xs md:text-sm">
              Selamat datang kembali! Silakan masukkan detail Anda.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">

            {/* Email Field */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Email
              </div>
              <input
                type="email"
                placeholder="Masukkan email anda"
                className="w-full px-3 py-2 md:py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                {...register("email", { required: "Email wajib diisi", pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Password
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password anda"
                  className="w-full px-3 py-2 md:py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pr-10"
                  {...register("password", { required: "Password wajib diisi", minLength: 8 })}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeClosed className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center bg-[#E77D35] hover:cursor-pointer text-white py-2 md:py-2.5 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Register Link */}
            <div className="text-center text-xs md:text-sm text-gray-600">
              Don't have an account?{' '}
              <Link className="text-orange-500 hover:text-orange-600 font-small" to={paths.auth.registerAsesi}>
                Register
              </Link>
            </div>
          </form>
          <div className="mt-10 flex items-center justify-center text-xs md:text-sm text-gray-600">
            <span>Developed by</span>
            <img
              src={getAssetPath('/img/logo-two-dev.svg')}
              alt=""
              className="w-20 ml-2"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Information Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center relative z-10 w-full">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-60"></div>
          <div className="absolute top-32 right-24 w-8 h-8 bg-orange-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-20 left-10 w-12 h-12 bg-cyan-200 rounded-full opacity-60"></div>
          <div className="absolute bottom-40 right-16 w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>

          {/* Main Content */}
          <div className="text-center flex justify-center items-center">
            {/* Certificate Icon */}
            <div className="w-138 object-cover rounded-lg text-center">
              <img src={getAssetPath('/img/hadline login.svg')} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}