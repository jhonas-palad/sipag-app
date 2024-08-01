import { Stack } from "expo-router";

const SignupStack = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="identity-form" />
      <Stack.Screen name="credentials-form" />
      <Stack.Screen name="upload-image" />
    </Stack>
  );
};

export default SignupStack;
