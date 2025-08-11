// src/app/ui/HydrationHandler.tsx

'use client';


import { useAuthStore } from '@/app/store/authStore';
import { useEffect, useState } from 'react';

// This component's only job is to delay rendering its children
// until the Zustand store has been rehydrated from localStorage.
export default function HydrationHandler({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for the store to rehydrate
  useEffect(() => {
    // The `useAuthStore.persist.onFinishHydration` is a listener that fires
    // once the store has finished re-populating its state.
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() =>
      setIsHydrated(true)
    );

    // If the store is already hydrated, we can set the state immediately.
    // This is useful for subsequent client-side navigations.
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    
    return () => {
      unsubFinishHydration();
    };
  }, []);

  return isHydrated ? <>{children}</> : null; // Render nothing until hydrated
}