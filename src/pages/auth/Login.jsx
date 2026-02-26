import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Chrome, Linkedin } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log('Submitting login:', data);
    login(data);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-dark-muted" />
            </div>
            <input
              type="email"
              {...register("email")}
              className={`input input-with-icon-left ${errors.email ? "input-error" : ""}`}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-dark-muted" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`input input-with-icons-both ${errors.password ? "input-error" : ""}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-dark-muted hover:text-dark-text transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-dark-muted hover:text-dark-text transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-dark-border bg-dark-bg2 text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0"
            />
            <span className="text-sm text-dark-muted">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoggingIn}
          className="btn btn-primary w-full btn-lg"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-dark-bg text-dark-muted">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-secondary">
            <Chrome className="w-5 h-5" />
            <span>Google</span>
          </button>
          <button type="button" className="btn btn-secondary">
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-dark-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary-400 font-medium transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;