import React, { useState } from 'react';
import { Eye, EyeClosed, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="min-h-screen flex w-full flex-row-reverse">
            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="rounded-lg pr-8 pl-8 w-full max-w-md">
                    {/* Logo and Title */}
                    <div className="text-start mb-4">
                        <div className="mb-10">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg text-start">
                                <img src="public/img/Group 24.svg" alt="" />
                            </div>
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

                        {/* Sign In Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            Sign Up
                        </button>

                        {/* Register Link */}
                        <div className="text-center text-sm text-gray-600">
                            Have an account?{' '}
                            <Link className="text-orange-500 hover:text-orange-600 font-small" to ='/login'>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Information Panel */}
            <div className="hidden lg:flex lg:flex-1 bg-blue-50 justify-center relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="w-134.5 object-cover rounded-lg text-center">
                    <img src="public/img/headline register.svg" alt="" />
                </div>
            </div>
        </div>
    );
}