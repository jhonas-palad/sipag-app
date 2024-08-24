import { Button } from "@/components/ui/Button";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { useRouter } from "expo-router";
import UploadPhotoForm from "@/components/forms/auth/UploadPhotoForm";
export default function ImagePickerExample() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <UploadPhotoForm />
      <View style={{ gap: 12 }}>
        <Button
          onPress={() => {
            router.dismiss();
          }}
          size="lg"
          type="outline"
          buttonStyle={{ borderWidth: 1.5 }}
          radius="lg"
        >
          Go back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 32,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  image: {
    width: 200,
    height: 200,
  },
});
