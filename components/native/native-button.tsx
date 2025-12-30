"use client";

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { hapticFeedback, isNative } from '@/lib/native-features';
import { ImpactStyle } from '@capacitor/haptics';

interface NativeButtonProps extends ButtonProps {
  hapticStyle?: ImpactStyle;
  enableHaptic?: boolean;
}

/**
 * Enhanced Button component with native haptic feedback
 */
const NativeButton = React.forwardRef<HTMLButtonElement, NativeButtonProps>(
  ({ hapticStyle = ImpactStyle.Light, enableHaptic = true, onClick, children, ...props }, ref) => {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableHaptic && isNative()) {
        await hapticFeedback(hapticStyle);
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

NativeButton.displayName = 'NativeButton';

export { NativeButton };

