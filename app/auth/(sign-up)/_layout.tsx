import { Stack } from "expo-router";
const SignupStack = () => {
  return (
    <Stack
      screenOptions={{ headerTitleAlign: "center", headerTitle: "Signup" }}
    >
      <Stack.Screen
        name="identity-form"
        // options={{ headerTitle: "Let's Get Started" }}
      />
      <Stack.Screen name="credentials-form" />
      <Stack.Screen name="upload-image" />
    </Stack>
  );
};

export default SignupStack;
