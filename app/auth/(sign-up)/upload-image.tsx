import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import UploadPhotoForm from "@/components/forms/auth/UploadPhotoForm";
export default function ImagePickerExample() {
  return (
    <View style={styles.container}>
      <UploadPhotoForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  image: {
    width: 200,
    height: 200,
  },
});
