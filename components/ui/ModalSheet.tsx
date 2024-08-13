import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useTheme } from "@rneui/themed";
import { forwardRef, useLayoutEffect, useRef } from "react";

export const BottomModalSheet = forwardRef<
  GBottomSheetModal,
  React.PropsWithoutRef<BottomSheetModalProps> & {
    open?: boolean;
    showHandle?: boolean;
  }
>(({ children, snapPoints, open, showHandle = true, ...props }, ref) => {
  const { theme } = useTheme();
  const innerRef = useRef(null);
  useLayoutEffect(() => {
    if (open) {
      //@ts-ignore
      (innerRef.current as BottomSheetModalMethods).present();
    }
  }, [ref, open]);
  return (
    <GBottomSheetModal
      handleIndicatorStyle={{
        display: showHandle ? "flex" : "none",
        backgroundColor: theme.colors.greyOutline,
        height: 6,
        width: 40,
      }}
      snapPoints={snapPoints}
      {...props}
      ref={(modal) => {
        if (ref) {
          //@ts-ignore
          ref.current = modal!;
        }
        //@ts-ignore
        innerRef.current = modal!;
      }}
    >
      {children}
    </GBottomSheetModal>
  );
});
