import { CommonReturnResult } from "@/global";
import * as ImagePicker from "expo-image-picker";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
export const pickImage = async (): Promise<ImagePicker.ImagePickerAsset> => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result) {
    throw new Error("An error occured during image picking.");
  }
  return {
    ...result.assets![0],
  };
};

export const usePickImage = (
  opts?: Omit<
    UseMutationOptions<ImagePicker.ImagePickerAsset, Error, void>,
    "mutationKey" | "mutationFn"
  >
) => {
  return useMutation<ImagePicker.ImagePickerAsset, Error, void>({
    mutationKey: ["pickImage"],
    async mutationFn() {
      return await pickImage();
    },
    ...opts,
  });
};
