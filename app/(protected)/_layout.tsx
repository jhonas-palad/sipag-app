import { LoadingScreen } from "@/components/LoadingScreen";
import { useIsValidToken } from "@/data/auth";
import { Redirect, Slot } from "expo-router";
import React from "react";

type Props = {};

const AuthenticatedLayout = (props: Props) => {
  const { isError, isPending } = useIsValidToken();

  if (isPending) {
    return <LoadingScreen />;
  }
  if (isError) {
    return <Redirect href="/auth" />;
  }

  return <Slot />;
};

export default AuthenticatedLayout;
