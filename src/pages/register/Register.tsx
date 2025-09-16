import React, { useState } from 'react';
import { Eye, EyeClosed, Clock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import paths from '@/routes/paths';
import { getAssetPath } from '@/utils/assetPath';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !email || !password || !confirmPassword) {
            setError('Semua field harus diisi');
            return;
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak sama');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            // Role ID 3 untuk Assessee (default untuk public registration)
            await registerUser(name, email, password, confirmPassword, 3);
            
            // Redirect to login page after successful registration
            navigate('/auth/login', { 
                state: { 
                    message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
                    email: email // Pre-fill email di login form
                }
            });
        } catch (err: any) {
            setError(err.message || 'Registrasi gagal');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full flex-row-reverse">
            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="rounded-lg pr-8 pl-8 w-full max-w-md">
                    {/* Logo and Title */}
                    <div className="text-start mb-4">
                        <div className="w-30 h-30 md:w-40 md:h-40 rounded-lg text-start">
                            <img src={getAssetPath('/img/logo-lsp-oren.svg')} alt="" className='w-full h-full' />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Buat Akun</h1>
                        <p className="text-gray-600 text-sm">
                            Masukkan data pribadi Anda untuk membuat akun Anda
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-3">
                        {/* Name Field */}
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-2">
                                Nama
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan nama anda"
                                className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                            />
                        </div>
                        {/* Email Field */}
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email anda"
                                className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan password anda"
                                    className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pr-10"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <EyeClosed className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* confirm pass */}
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Masukkan password anda lagi"
                                    className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm pr-10"
                                />
                                <button
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <EyeClosed className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-[#E77D35] hover:cursor-pointer text-white py-2 md:py-2.5 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-600">
                            Have an account?{' '}
                            <Link className="text-orange-500 hover:text-orange-600 font-small" to='/auth/login'>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="block sm:hidden fixed bottom-0 pb-10 flex items-center justify-center text-xs md:text-sm text-gray-600 w-full bg-white">
                    <span>Developed by</span>
                    <img
                        src={getAssetPath('/img/logo-two-dev.svg')}
                        alt=""
                        className="w-20 ml-2"
                    />
                </div>
            </div>

            {/* Left Side - Information Panel */}
            <div className="hidden lg:flex lg:flex-1 bg-[#F0F5FA4D] justify-center relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="w-134.5 object-cover rounded-lg text-center">
                    <img src={getAssetPath('/img/headline-register.png')} alt="" />
                </div>
            </div>
        </div>
    );
}