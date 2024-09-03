import React, { forwardRef } from "react";
import { FAB as RNEFAB, FABProps } from "@rneui/themed";
import { Link } from "expo-router";
import { Button } from "react-native";
import { LinkProps } from "expo-router/build/link/Link";

export const FAB = forwardRef<Button, React.PropsWithoutRef<FABProps>>(
  ({ ...props }, ref) => {
    return <RNEFAB {...props} />;
  }
);
FAB.displayName = "FAB";

export const LinkFAB = ({
  href,
  push,
  replace,
  ...props
}: FABProps & LinkProps<string>) => {
  return (
    <Link href={href} push={push} replace={replace} asChild>
      <FAB {...props} />
    </Link>
  );
};
