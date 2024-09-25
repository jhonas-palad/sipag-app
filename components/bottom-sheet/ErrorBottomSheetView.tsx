import React from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { View } from "../ui/View";
import { Button } from "../ui/Button";
import { useRefreshQuery } from "@/hooks/queries/useRefreshQuery";
import { QueryKey } from "@tanstack/react-query";

type ErrorBottomSheetViewProps = {
  children: React.ReactNode;
  queryKey?: QueryKey;
};
export const ErrorBottomSheetView = ({
  children,
  queryKey,
}: ErrorBottomSheetViewProps) => {
  const handleRefresh = useRefreshQuery({ queryKey });
  return (
    <BottomSheetView>
      {children}
      {queryKey && (
        <View transparent style={{ marginHorizontal: 32, marginTop: 16}}>
          <Button onPress={() => handleRefresh()} title="Retry" />
        </View>
      )}
    </BottomSheetView>
  );
};
