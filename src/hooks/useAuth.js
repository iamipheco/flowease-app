import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "../api";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // ========================
  // LOGIN
  // ========================
  const loginMutation = useMutation({
    mutationFn: authAPI.login,

    onSuccess: (response) => {
      const { user: userData, accessToken, refreshToken } = response.data;

      if (!userData || !accessToken) {
        toast.error("Login failed - Invalid response from server");
        return;
      }

      setAuth(userData, accessToken, refreshToken);

      toast.success(`Welcome back, ${userData.name}!`);
      navigate("/dashboard", { replace: true });
    },

    onError: (error) => {
      console.error("Login error:", error);

      // Handle different error cases
      if (error.response) {
        const { status, data } = error.response;

        // Email not verified
        if (status === 403 && data?.emailVerified === false) {
          toast.error("Please verify your email before logging in", {
            description: "Check your inbox for the verification link",
            duration: 5000,
          });
          return;
        }

        // Unauthorized (wrong credentials)
        if (status === 401) {
          toast.error("Invalid credentials", {
            description: "Please check your email and password",
            duration: 4000,
          });
          return;
        }

        // User not found
        if (status === 404) {
          toast.error("Account not found", {
            description: "No account exists with this email",
            duration: 4000,
          });
          return;
        }

        // Too many requests
        if (status === 429) {
          toast.error("Too many login attempts", {
            description: "Please try again later",
            duration: 5000,
          });
          return;
        }

        // Server error
        if (status >= 500) {
          toast.error("Server error", {
            description: "Something went wrong. Please try again later",
            duration: 4000,
          });
          return;
        }

        // Generic error with message from backend
        toast.error("Login failed", {
          description: data?.message || "Unable to login. Please try again",
          duration: 4000,
        });
      } else if (error.request) {
        // Network error
        toast.error("Network error", {
          description: "Unable to connect to server. Check your connection",
          duration: 4000,
        });
      } else {
        // Other errors
        toast.error("Login failed", {
          description: error.message || "An unexpected error occurred",
          duration: 4000,
        });
      }
    },
  });

  // ========================
  // REGISTER
  // ========================
  const registerMutation = useMutation({
    mutationFn: authAPI.register,

    onSuccess: (data) => {
      toast.success("Account created successfully! Please verify your email.", {
        duration: 5000,
      });
      navigate("/login", { replace: true });
    },

    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");

      if (error.response) {
        const { status, data } = error.response;

        // User already exists
        if (status === 400 && data?.message?.includes("already exists")) {
          toast.error("Email already registered", {
            description: "An account with this email already exists",
            duration: 4000,
            action: {
              label: "Login",
              onClick: () => navigate("/login"),
            },
          });
          return;
        }

        // Validation error
        if (status === 400) {
          toast.error("Invalid registration data", {
            description: data?.message || "Please check your information",
            duration: 4000,
          });
          return;
        }

        // Server error
        if (status >= 500) {
          toast.error("Server error", {
            description: "Unable to create account. Please try again later",
            duration: 4000,
          });
          return;
        }

        // Generic error
        toast.error("Registration failed", {
          description: data?.message || "Unable to create account",
          duration: 4000,
        });
      } else if (error.request) {
        // Network error
        toast.error("Network error", {
          description: "Unable to connect to server. Check your connection",
          duration: 4000,
        });
      } else {
        // Other errors
        toast.error("Registration failed", {
          description: error.message || "An unexpected error occurred",
          duration: 4000,
        });
      }
    },
  });

  // ========================
  // LOGOUT
  // ========================
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("Backend logout failed:", err.message);
    }

    logoutStore();

    // Better than clear()
    queryClient.removeQueries();

    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
