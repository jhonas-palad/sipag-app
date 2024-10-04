import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Button } from "./ui/Button";
import { mergeRefs } from "@/utils/refs";
import { useCamera, usePickImage } from "@/hooks/usePickImage";
import { ImagePickerAsset } from "expo-image-picker";
import { Keyboard } from "react-native";
type ImagePickerOptionsContextT = {
  imageData: ImagePickerAsset | undefined;
  openPickers: () => void;
};

const ImagePickerOptionsContext =
  React.createContext<ImagePickerOptionsContextT | null>(null);

const ImagePickerOptions = forwardRef<
  BottomSheetMethods,
  Omit<BottomSheetProps, "children"> & {
    onError?: (
      error: Error,
      variables: void,
      context: unknown
    ) => Promise<unknown> | unknown;
    onSuccess?: (
      data: ImagePickerAsset,
      variables: void,
      context: unknown
    ) => Promise<unknown> | unknown;
    children?: React.ReactNode;
  }
>(({ onError, onSuccess, children, ...props }, ref) => {
  const innerRef = useRef<BottomSheetMethods>(null);
  const [using, setUsing] = useState<"camera" | "lib">();
  const [close, setClose] = useState(true);

  const { mutateAsync: launchImageLib, data: libImageData } = usePickImage({
    onError,
    onSuccess: (data, variables, context) => {
      setUsing("lib");
      onSuccess?.(data, variables, context);
    },
  });
  const { mutateAsync: launchCamera, data: cameraImageData } = useCamera({
    onError,
    onSuccess: (data, variables, context) => {
      setUsing("camera");
      onSuccess?.(data, variables, context);
    },
  });

  const imageData = useMemo(
    () => (using === "lib" ? libImageData : cameraImageData),
    [using, libImageData, cameraImageData]
  );

  const openPickers = () => {
    if (close) {
      setClose(false);
    }
    if (innerRef.current) {
      innerRef.current.expand();
      Keyboard.dismiss();
    }
  };
  useEffect(() => {
    if (innerRef.current && imageData) {
      innerRef.current.forceClose();
    }
  }, [imageData, cameraImageData, innerRef]);
  return (
    <ImagePickerOptionsContext.Provider value={{ imageData, openPickers }}>
      {children}
      {!close && (
        <BottomSheet
          ref={mergeRefs([innerRef, ref])}
          snapPoints={["20%"]}
          enablePanDownToClose
          {...props}
        >
          <BottomSheetView
            style={{
              gap: 8,
              flex: 1,
              paddingHorizontal: 16,
              justifyContent: "center",
            }}
          >
            <Button
              title="Camera"
              onPress={() => launchCamera()}
              type="outline"
            />
            <Button
              title="Gallery"
              onPress={() => launchImageLib()}
              type="outline"
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </ImagePickerOptionsContext.Provider>
  );
});

ImagePickerOptions.displayName = "ImagePickerOptions";

const useImagePickerContext = () => {
  const result = useContext(ImagePickerOptionsContext);
  if (!result) {
    throw new Error(
      "useImagePickerContext must be used within ImagePickerOptions"
    );
  }
  return result;
};

export { ImagePickerOptions, useImagePickerContext };
