import React, { Suspense } from "react";

export default function dynamic<T extends object>(
  loader: () => Promise<{ default: React.ComponentType<T> }>,
) {
  const LazyComponent = React.lazy(loader);

  return function DynamicComponent(props: T) {
    return (
      <Suspense fallback={null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
