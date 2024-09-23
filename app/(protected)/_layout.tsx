import { LoadingScreen } from "@/components/LoadingScreen";
import { useVerifiedUser } from "@/data/auth";
import { KEYWORDS } from "@/lib/constants";
import { log } from "@/utils/logger";
import { Redirect, Slot } from "expo-router";
import React from "react";

type Props = {};

const AuthenticatedLayout = (props: Props) => {
  const [tokenQuery, userQuery] = useVerifiedUser();

  if (tokenQuery.isLoading || userQuery.isLoading) {
    return <LoadingScreen />;
  }
  log.debug(userQuery.error, tokenQuery.error);
  if (tokenQuery.isError || userQuery.isError) {
    if (
      tokenQuery.error?.message === KEYWORDS.NO_TOKEN_FOUND ||
      tokenQuery.error?.status === 401 ||
      userQuery.error?.status === 401
    ) {
      return <Redirect href="/auth" />;
    } else if (userQuery.error?.message === KEYWORDS.NOT_VERIFIED_USER) {
      return <Redirect href="/auth/not-verified" />;
    }

    return <Redirect href="/error" />;
  }

  return <Slot />;
};

export default AuthenticatedLayout;
