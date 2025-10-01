import React from 'react';

/**
 * SkeletonImageGrid
 * A simple, accessible skeleton loader component for image grids.
 * - TailwindCSS utility-first classes are used for styling
 * - Default export is a React component file that can be copied/used directly
 *
 * Props:
 *  - count: number of skeleton items to show (overrides rows/cols)
 *  - rows, cols: grid layout if `count` is not provided
 *  - gap: Tailwind gap class (e.g. 'gap-4')
 *  - aspectRatio: Tailwind aspect ratio class (e.g. 'aspect-video', 'aspect-square')
 *  - animate: boolean to enable/disable pulse animation
 *  - showTextLines: boolean to show placeholder text lines under each image
 *  - className: extra classes to apply to wrapper
 */

export default function SkeletonImageGrid({
  count = 8,
  rows = null,
  cols = 4,
  gap = 'gap-4',
  aspectRatio = 'aspect-[4/3]',
  animate = true,
  showTextLines = true,
  className = '',
}) {
  // compute finalCount
  const finalCount = count || (rows ? rows * cols : cols * (rows || 2));
  const pulse = animate ? 'animate-pulse' : '';
  const skeletonBg = 'bg-gray-200 dark:bg-gray-700';

  // grid classes (responsive: collapse to fewer columns on small screens)
  const gridCols = `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols}`;

  const items = Array.from({ length: finalCount });

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading images"
      className={`w-full ${className}`}
    >
      <div className={`grid ${gridCols} ${gap}`}>
        {items.map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className={`rounded-lg overflow-hidden ${pulse} ${skeletonBg} ${aspectRatio}`} />

            {showTextLines && (
              <div className="mt-3 space-y-2">
                <div className={`${pulse} ${skeletonBg} h-3 rounded w-3/4`} />
                <div className={`${pulse} ${skeletonBg} h-3 rounded w-1/2`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/*
Usage examples:

// Basic usage
<SkeletonImageGrid />

// Set columns and count
<SkeletonImageGrid cols={5} count={10} />

// Disable animation
<SkeletonImageGrid animate={false} />

// Custom gap and aspect ratio
<SkeletonImageGrid gap="gap-6" aspectRatio="aspect-square" />

Notes:
- This file uses Tailwind utility classes (animate-pulse, bg-gray-200, aspect-*). If you don't use Tailwind, replace classes with your own CSS.
- The component is accessible: role="status" and aria-live communicate loading state to assistive tech.
*/
