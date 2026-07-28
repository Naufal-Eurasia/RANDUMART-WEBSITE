'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const handleThumbPointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
    document.body.style.cursor = 'grabbing';
  };

  const handleThumbPointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
    document.body.style.cursor = '';
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      style={{ touchAction: 'pan-x' }}
      className={cn(
        'relative flex h-8 w-full select-none items-center',
        className
      )}
      minStepsBetweenThumbs={0}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        className="
        relative
        h-2.5
        w-full
        grow
        overflow-hidden
        rounded-full
        bg-gray-200
        dark:bg-gray-700
      "
      >
        {/* Active Range */}
        <SliderPrimitive.Range
          className="
          absolute
          h-full
          rounded-full
          bg-primary
          transition-all
          duration-100
          ease-out
        "
        />
      </SliderPrimitive.Track>

      {/* Thumb */}
      <SliderPrimitive.Thumb
        onPointerDown={handleThumbPointerDown}
        onPointerUp={handleThumbPointerUp}
        onPointerCancel={handleThumbPointerUp}
        className="
        block
        h-6
        w-6
        rounded-full
        border-4
        border-primary
        bg-white
        shadow-lg
        transition-all
        duration-100
        ease-out

        cursor-grab
        active:cursor-grabbing

        hover:scale-110
        active:scale-95

        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-primary/20

        disabled:pointer-events-none
        disabled:opacity-50
      "
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };