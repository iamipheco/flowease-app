import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401 or 403
        if (error?.response?.status === 401) return false;
        if (error?.response?.status === 403) return false;

        // Retry once for other errors
        return failureCount < 1;
      },

      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },

    mutations: {
      retry: false,
    },
  },
});