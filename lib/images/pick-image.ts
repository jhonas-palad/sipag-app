import * as ImagePicker from "expo-image-picker";
export const launchImageLibrary =
  async (): Promise<ImagePicker.ImagePickerAsset> => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    return {
      ...result.assets![0],
    };
  };

export async function launchCamera() {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  return {
    ...result.assets![0],
  };
}
