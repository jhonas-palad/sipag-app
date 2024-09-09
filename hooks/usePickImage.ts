import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { pickImage } from "@/lib/images/pick-image";
import * as ImagePicker from "expo-image-picker";

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
