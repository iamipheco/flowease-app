import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/layout/AuthLayout";
import { authAPI } from "../../api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Password reset email sent!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    setSubmittedEmail(data.email);
    forgotPasswordMutation.mutate(data.email);
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a password reset link to ${submittedEmail}`}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          <div className="bg-dark-bg2 border border-dark-border rounded-lg p-4">
            <p className="text-sm text-dark-muted mb-2">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-primary hover:text-primary-400 font-medium"
            >
              Try another email address
            </button>
          </div>

          <Link
            to="/login"
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="btn btn-primary w-full btn-lg"
        >
          {forgotPasswordMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            "Send reset link"
          )}
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-dark-muted hover:text-dark-text inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;