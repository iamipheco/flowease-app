/* ======================================================
   src/pages/auth/AuthCallback.jsx
   OAuth Callback Handler - Google & LinkedIn
====================================================== */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuthStore } from "../../store/authStore";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    // Check for error in URL params
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages = {
        google_auth_failed: "Google authentication failed. Please try again.",
        linkedin_auth_failed: "LinkedIn authentication failed. Please try again.",
        access_denied: "Access denied. You cancelled the authentication.",
      };

      const errorMessage =
        errorMessages[errorParam] || "Authentication failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    // Get token and user data from URL params
    // Backend sends: accessToken, refreshToken (not 'token')
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      setError("Invalid authentication response. Please try again.");
      toast.error("Invalid authentication response", {
        description: "Missing access token",
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      // Decode the JWT to get user data
      // JWT format: header.payload.signature
      const payload = accessToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      // Get user data from the decoded token
      const user = {
        _id: decodedPayload.id,
        id: decodedPayload.id,
        email: decodedPayload.email,
        name: decodedPayload.name || decodedPayload.email.split('@')[0], // Fallback to email username
        role: decodedPayload.role || 'user',
      };

      // Store auth data
      setAuth(user, accessToken, refreshToken);

      // Success message
      toast.success(`Welcome back, ${user.name}!`, {
        description: 'Successfully logged in with OAuth',
        duration: 3000,
      });

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("OAuth callback error:", err);
      setError("Failed to process authentication. Please try again.");
      toast.error("Authentication processing failed", {
        description: err.message || "Unable to decode token",
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  // Error State
  if (error) {
    return (
      <AuthLayout
        title="Authentication failed"
        subtitle={error}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <p className="text-sm text-dark-text">
              Redirecting to login in 3 seconds...
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="btn btn-secondary w-full"
          >
            Go to login now
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Loading State
  return (
    <AuthLayout
      title="Completing sign in"
      subtitle="Please wait while we complete your authentication"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-dark-muted">
            Processing your authentication...
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthCallback;