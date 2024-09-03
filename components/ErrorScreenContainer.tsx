import { View } from "./ui/View";
import { ViewProps } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@rneui/themed";
import React, { useCallback } from "react";

type Props = {
  queryKey?: string;
} & ViewProps;

const ErrorScreenContainer = ({
  style,
  children,
  queryKey,
  ...props
}: Props) => {
  const queryClient = useQueryClient();
  const handleRefresh = useCallback(() => {
    if (!queryKey) {
      return;
    }
    queryClient.refetchQueries({
      queryKey: [queryKey!],
    });
  }, [queryKey, queryClient]);
  return (
    <View
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
      {...props}
    >
      {children}
      {queryKey && (
        <Button
          title="Refresh"
          loading={queryClient.isFetching({ queryKey: [queryKey!] }) !== 0}
          onPress={() => {
            handleRefresh();
          }}
        />
      )}
    </View>
  );
};

export default ErrorScreenContainer;
