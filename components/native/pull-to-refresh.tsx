"use client";

import { useEffect, useRef, useState } from 'react';
import { isNative, hapticFeedback } from '@/lib/native-features';
import { ImpactStyle } from '@capacitor/haptics';
import { RefreshCcw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Pull-to-refresh component for native apps
 */
export default function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isNativeApp = isNative();

  useEffect(() => {
    if (!isNativeApp || disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0 && container.scrollTop === 0) {
        const pullDistance = Math.min(distance * 0.5, 80);
        setPullDistance(pullDistance);
        
        if (pullDistance > 60) {
          hapticFeedback(ImpactStyle.Light);
        }
      } else {
        setPullDistance(0);
        isPulling.current = false;
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;

      if (pullDistance > 60) {
        setIsRefreshing(true);
        await hapticFeedback(ImpactStyle.Medium);
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Error refreshing:', error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }

      isPulling.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isNativeApp, disabled, pullDistance, onRefresh]);

  if (!isNativeApp) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative h-full overflow-auto">
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white px-4 py-2 flex items-center justify-center gap-2">
          <RefreshCcw className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Refreshing...</span>
        </div>
      )}
      {pullDistance > 0 && !isRefreshing && (
        <div
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center py-2 bg-gray-100 dark:bg-gray-800 transition-transform"
          style={{ transform: `translateY(${Math.min(pullDistance, 60)}px)` }}
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <RefreshCcw
              className="h-5 w-5"
              style={{
                transform: `rotate(${pullDistance * 4}deg)`,
              }}
            />
            <span className="text-sm">
              {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      <div style={{ paddingTop: isRefreshing ? '40px' : '0' }}>
        {children}
      </div>
    </div>
  );
}

