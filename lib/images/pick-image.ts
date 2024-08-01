import { CommonReturnResult } from "@/global";
import * as ImagePicker from "expo-image-picker";

export const pickImage = async (): Promise<CommonReturnResult<ImagePicker.ImagePickerAsset>> => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    base64: true,
    quality: 1,
  });

  if (!result || result.canceled) {
    console.log("Result", result);
    return {
      error: "Can't pick an image. Reason: Request failed",
    };
  }
  return {
    result: {
      ...result.assets[0]!,
    },
  };
};
