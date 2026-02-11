import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getAssetPath } from "@/utils/assetPath";
import paths from "@/routes/paths";
import { useAuth } from "@/contexts/AuthContext";
import useToast from "@/components/ui/useToast";

type FormValues = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function RegisterForm() {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { isSubmitting, errors },
	} = useForm<FormValues>();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { register: registerUser } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const toast = useToast();

	// Pre-fill email if redirected from login
	useEffect(() => {
		if (location.state?.email) {
			setValue("email", location.state.email);
		}
		if (location.state?.message) {
			toast.show({
				description: location.state.message,
				type: "success",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.state, setValue]);

	const onSubmit = async (data: FormValues) => {
		const { name, email, password, confirmPassword } = data;

		if (password !== confirmPassword) {
			toast.show({
				description: "Password dan konfirmasi password tidak sama",
				type: "error",
			});
			return;
		}

		if (password.length < 6) {
			toast.show({
				description: "Password minimal 8 karakter",
				type: "error",
			});
			return;
		}

		try {
			await registerUser(name, email, password, confirmPassword, 3); // role 3 = Assessee
			toast.show({
				description: "Registrasi berhasil! Silakan login dengan akun Anda.",
				type: "success",
			});
			reset();
			navigate(paths.auth.login, {
				state: {
					email,
					message: "Registrasi berhasil! Silakan login dengan akun Anda.",
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.show({
				description: err?.response?.data?.message || err.message,
				type: "error",
			});
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
							<img
								src={getAssetPath("/img/logo-lsp-oren.svg")}
								alt=""
								className="w-full h-full"
							/>
						</div>
						<h1 className="text-2xl font-semibold text-gray-900 mb-2">
							Buat Akun
						</h1>
						<p className="text-gray-600 text-sm">
							Masukkan data pribadi Anda untuk membuat akun Anda
						</p>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4 md:space-y-5"
					>
						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
								Nama
							</label>
							<input
								type="text"
								placeholder="Masukkan nama anda"
								{...register("name", { required: "Nama wajib diisi" })}
								className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name.message}</p>
							)}
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
								Email
							</label>
							<input
								type="email"
								placeholder="Masukkan email anda"
								{...register("email", {
									required: "Email wajib diisi",
									pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								})}
								className="w-full px-3 py-2.5 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm">{errors.email.message}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Masukkan password"
									{...register("password", {
										required: "Password wajib diisi",
										minLength: {
                                            value: 8,
                                            message: "Password minimal 8 karakter",
                                        },
									})}
									className="w-full px-3 py-2.5 pr-10 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
								/>
								<button
									type="button"
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
							{errors.password && (
								<p className="text-red-500 text-sm">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
								Konfirmasi Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Masukkan kembali password"
									{...register("confirmPassword", {
										required: "Konfirmasi password wajib diisi",
										validate: (value) =>
											value === watch("password") || "Password tidak sama",
										minLength: 8,
									})}
									className="w-full px-3 py-2.5 pr-10 bg-[#DADADA33] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
								/>
								<button
									type="button"
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
							{errors.confirmPassword && (
								<p className="text-red-500 text-sm">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full flex items-center justify-center bg-[#E77D35] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Membuat Akun...
								</>
							) : (
								"Buat Akun"
							)}
						</button>

						{/* Login Link */}
						<div className="text-center text-sm text-gray-600">
							Sudah punya akun?{" "}
							<Link
								className="text-orange-500 hover:text-orange-600"
								to={paths.auth.login}
							>
								Masuk
							</Link>
						</div>
					</form>
					<div className="block sm:hidden fixed bottom-0 pb-10 flex items-center justify-center text-xs md:text-sm text-gray-600 w-full bg-white">
						<span>Developed by</span>
						<img
							src={getAssetPath("/img/logo-two-dev.svg")}
							alt=""
							className="w-20 ml-2"
						/>
					</div>
				</div>
			</div>
			{/* Left Side - Information Panel */}
			<div className="hidden lg:flex lg:flex-1 bg-[#F0F5FA4D] justify-center relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="w-134.5 object-cover rounded-lg text-center">
					<img src={getAssetPath("/img/headline-register.png")} alt="" />
				</div>
			</div>
		</div>
	);
}
