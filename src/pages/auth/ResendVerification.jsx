import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/layout/AuthLayout";
import { authAPI } from "../../api";

const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const ResendVerification = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resendVerificationSchema),
  });

  const resendVerificationMutation = useMutation({
    mutationFn: authAPI.resendVerification,
    onSuccess: () => {
      setEmailSent(true);
      toast.success("Verification email sent!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    setSubmittedEmail(data.email);
    resendVerificationMutation.mutate(data.email);
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Verification email sent!"
        subtitle={`We've sent a new verification link to ${submittedEmail}`}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          <div className="bg-dark-bg2 border border-dark-border rounded-lg p-4">
            <p className="text-sm text-dark-text font-medium mb-3">
              Next steps:
            </p>
            <ol className="text-sm text-dark-muted text-left space-y-2 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return to login</li>
            </ol>

            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-xs text-dark-muted mb-2">
                Didn't receive it? Check your spam folder or
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-xs text-primary hover:text-primary-400 font-medium"
              >
                Try another email address
              </button>
            </div>
          </div>

          <Link to="/login" className="btn btn-primary w-full btn-lg">
            Continue to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Resend verification email"
      subtitle="Enter your email to receive a new verification link"
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

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-dark-text">
            <strong>Note:</strong> The verification link will expire in 24
            hours.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={resendVerificationMutation.isPending}
          className="btn btn-primary w-full btn-lg"
        >
          {resendVerificationMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            "Send verification email"
          )}
        </button>

        {/* Back to Login */}
        <p className="text-center text-sm text-dark-muted">
          Already verified?{" "}
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

export default ResendVerification;