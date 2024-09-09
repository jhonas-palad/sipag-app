import { Redirect, Stack } from "expo-router";
import React from "react";
import { useGetOnBoardingFlag } from "@/hooks/useGetOnboardingFlag";
import { LoadingScreen } from "@/components/LoadingScreen";
type Props = {};

const OnboardingLayout = (props: Props) => {
  const { data: onboardingFlag, isLoading } = useGetOnBoardingFlag();
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!!onboardingFlag) {
    return <Redirect href="/(protected)/(tabs)/(home)/" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default OnboardingLayout;
