import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Linkedin,
  Check,
} from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = (data) => {
    const { terms, ...userData } = data;
    registerUser(userData);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your tasks efficiently"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-dark-muted" />
            </div>
            <input
              type="text"
              {...register("name")}
              className={`input input-with-icon-left ${errors.name ? "input-error" : ""}`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-error">{errors.name.message}</p>
          )}
        </div>

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
              placeholder="Create a strong password"
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

          {/* Password Requirements */}
          {password && (
            <div className="mt-3 p-3 bg-dark-bg2 border border-dark-border rounded-lg">
              <p className="text-xs font-medium text-dark-muted mb-2">
                Password must contain:
              </p>
              <div className="space-y-1.5">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? "bg-success/20" : "bg-dark-bg3"
                      }`}
                    >
                      {req.met && <Check className="w-3 h-3 text-success" />}
                    </div>
                    <span
                      className={`text-xs ${
                        req.met ? "text-success" : "text-dark-muted"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="mt-1.5 text-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register("terms")}
              className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-bg2 text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0"
            />
            <span className="text-sm text-dark-muted group-hover:text-dark-text transition-colors">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:text-primary-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary hover:text-primary-400"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-sm text-error">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isRegistering}
          className="btn btn-primary w-full btn-lg"
        >
          {isRegistering ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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
            Google
          </button>
          <button type="button" className="btn btn-secondary">
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-dark-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
