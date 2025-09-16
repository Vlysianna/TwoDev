import { useState, useEffect } from 'react';
import { Eye, EyeClosed, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import paths from '@/routes/paths';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { getAssetPath } from '@/utils/assetPath';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Handle success message and pre-fill email from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state]);

  const onSubmit = async (data: FormValues) => {

    const { email, password } = data;

    if (!email || !password) {
      setError('Email dan password harus diisi');
      setSuccessMessage('');
      return;
    }

    setError('');
    setSuccessMessage('');
    
    await login(email, password).then(() => {
      setSuccessMessage('Login berhasil');
      navigate(from, { replace: true });
    }).catch((err: any) => {
      // console.log(err);
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan';
      setError(errorMessage);
    });
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

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
                {...register("email", { required: "Email wajib diisi" })}
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
                  {...register("password", { required: "Password wajib diisi" })}
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

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="text-xs md:text-sm text-black-500 hover:text-gray-700 hover:cursor-pointer font-small">
                Lupa password?
              </button>
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
        </div>
        <div className="fixed bottom-0 pb-10 flex items-center justify-center text-xs md:text-sm text-gray-600">
          <span>Developed by</span>
          <img
            src={getAssetPath('/img/logo-two-dev.svg')}
            alt=""
            className="w-20 ml-2"
          />
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