import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Lock, Eye, EyeOff, CheckCircle, Check } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/layout/AuthLayout";
import { authAPI } from "../../api";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const resetPasswordMutation = useMutation({
    mutationFn: (password) => authAPI.resetPassword({ token, password }),
    onSuccess: () => {
      setResetSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    resetPasswordMutation.mutate(data.password);
  };

  if (resetSuccess) {
    return (
      <AuthLayout
        title="Password reset successful!"
        subtitle="Redirecting you to login..."
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          <p className="text-dark-muted">
            Your password has been reset successfully.
          </p>

          <Link to="/login" className="btn btn-primary w-full btn-lg">
            Continue to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* New Password Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            New password
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

        {/* Confirm Password Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-dark-muted" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`input input-with-icons-both ${errors.confirmPassword ? "input-error" : ""}`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-dark-muted hover:text-dark-text transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-dark-muted hover:text-dark-text transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="btn btn-primary w-full btn-lg"
        >
          {resetPasswordMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Resetting password...</span>
            </div>
          ) : (
            "Reset password"
          )}
        </button>

        {/* Back to Login */}
        <p className="text-center text-sm text-dark-muted">
          Remember your password?{" "}
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

export default ResetPassword;