import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Something went wrong');
      },
    },
    mutations: {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Something went wrong');
      },
    },
  },
});