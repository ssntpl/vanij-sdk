'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StorefrontProvider, CartProvider } from '@vanij/storefront-sdk/react';
import { client } from '@/lib/client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StorefrontProvider client={client}>
        <CartProvider>{children}</CartProvider>
      </StorefrontProvider>
    </QueryClientProvider>
  );
}
