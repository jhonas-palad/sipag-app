import React from "react";

//Source https://github.com/gregberge/react-merge-refs/blob/main/src/index.tsx
export function mergeRefs<T = any>(
  refs:
    | React.MutableRefObject<T>[]
    | React.LegacyRef<T>[]
    | undefined[]
    | null[]
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
