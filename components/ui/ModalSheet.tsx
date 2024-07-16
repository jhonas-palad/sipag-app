import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { forwardRef } from "react";

export const BottomModalSheet = forwardRef<
  BottomSheetModalMethods,
  React.PropsWithoutRef<BottomSheetProps>
>(({ children, snapPoints, ...props }, ref) => {
  console.log("asdsadasdas", snapPoints);
  return (
    <GBottomSheetModal snapPoints={[400, '80%']} {...props} ref={ref}>
      {children}
    </GBottomSheetModal>
  );
});
