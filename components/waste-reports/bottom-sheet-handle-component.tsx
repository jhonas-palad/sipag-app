import { View } from "../ui/View";
import { LinkFAB } from "../ui/FAB";
import { FAB } from "../ui/FAB";
import { useTheme } from "@rneui/themed";
import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WASTE_REPORTS } from "@/data/waste-reports";
type Props = {};

const BottomSheetHandleComponent = (props: Props) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
  }, [queryClient]);
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: -50,
          backgroundColor: "transparent",
          width: "100%",
        }}
      >
        <View
          transparent
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            marginHorizontal: 20,
          }}
        >
          <LinkFAB
            href={"/create-waste-report"}
            icon={{ name: "add" }}
            size="small"
          />

          <FAB icon={{ name: "sync" }} size="small" onPress={handleRefresh} />
        </View>
      </View>
      <View
        style={{
          paddingVertical: 12,
          alignItems: "center",
          borderRadius: 50,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.grey3,
            borderRadius: 50,
            width: 30,
            height: 4,
          }}
        />
      </View>
    </>
  );
};

export default BottomSheetHandleComponent;
