import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { authAPI } from "../../api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // ✅ Only run if token exists
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => authAPI.verifyEmail(token), // authAPI should return response.data
    retry: false,
    enabled: !!token,
  });

  // Auto-redirect to login on success
  useEffect(() => {
    if (data?.success) {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [data, navigate]);

  // ======================
  // Loading State
  // ======================
  if (isLoading) {
    return (
      <AuthLayout
        title="Verifying your email"
        subtitle="Please wait while we verify your email address"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-dark-muted">This will only take a moment...</p>
        </div>
      </AuthLayout>
    );
  }

  // ======================
  // Success State
  // ======================
  if (data?.success) {
    return (
      <AuthLayout
        title="Email verified!"
        subtitle={data.alreadyVerified ? "Email was already verified." : "Your email has been verified successfully"}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>

          <div className="bg-dark-bg2 border border-dark-border rounded-lg p-4">
            <p className="text-sm text-dark-muted">
              Redirecting to login in 3 seconds...
            </p>
          </div>

          <Link to="/login" className="btn btn-primary w-full btn-lg">
            Continue to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ======================
  // Error State
  // ======================
  if (isError) {
    const message =
      error?.response?.data?.message ||
      "The verification link may be invalid or expired";

    return (
      <AuthLayout title="Verification failed" subtitle={message}>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-error" />
          </div>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <p className="text-sm text-dark-text font-medium mb-2">
              What can you do?
            </p>
            <ul className="text-sm text-dark-muted text-left space-y-1 list-disc list-inside">
              <li>Request a new verification email</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              to="/resend-verification"
              className="btn btn-primary w-full btn-lg"
            >
              Resend verification email
            </Link>

            <Link to="/login" className="btn btn-secondary w-full">
              Back to login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return null;
};

export default VerifyEmail;