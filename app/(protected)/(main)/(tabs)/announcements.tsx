import {
  FlatList,
  ActivityIndicator,
  ViewStyle,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Button, useTheme } from "@rneui/themed";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import ErrorScreenContainer from "@/components/ErrorScreenContainer";
import { Image } from "expo-image";
import { dateFormat } from "@/utils/date";
import { useGetAnnouncements } from "@/hooks/queries/useGetAnnouncements";
import { useRefreshQuery } from "@/hooks/queries/useRefreshQuery";
import { KEYWORDS } from "@/lib/constants";
import { usePushNotifications } from "@/components/PushNotificationProvider";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
type Props = {};

const AnnoucementsScreen = (props: Props) => {
  const { theme } = useTheme();
  const { data, isLoading, isError } = useGetAnnouncements();
  const queryClient = useQueryClient();
  const { notification, resetCount } = usePushNotifications();
  const handleRefresh = useRefreshQuery({
    queryKey: [KEYWORDS.ANNOUNCEMENTS.base],
  });

  useEffect(() => {
    if (notification) {
      queryClient.invalidateQueries({
        queryKey: [KEYWORDS.ANNOUNCEMENTS.base],
      });
    }
  }, [notification, queryClient]);

  useFocusEffect(() => {
    resetCount();
  });
  const renderItem = useCallback(
    ({ item }: any) => {
      const ts = dateFormat(item?.date_created, "PPpp");
      return (
        <View
          style={{
            marginHorizontal: 24,
            backgroundColor: theme.colors.white,
            padding: 12,
            marginVertical: 4,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Avatar
            size="small"
            title="S"
            rounded
            containerStyle={{ backgroundColor: theme.colors.primary }}
          ></Avatar>
          <View transparent style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item?.title}</Text>
            <Text style={{}}>{item?.description}</Text>
            <Text style={{ color: theme.colors.grey0 }}>{ts}</Text>
          </View>
          <View>
            <Image
              contentFit="cover"
              style={{
                width: 50,
                height: 50,
                borderRadius: theme.spacing.md,
              }}
              // placeholder={item.post.thumbnail.hash}
              // source={{ uri: item.post.thumbnail.img_file }}
            />
          </View>
        </View>
      );
    },
    [theme]
  );
  const renderEmpty = useCallback(() => {
    return (
      <View transparent>
        <Text h4>No announcements at the moment 🌿</Text>
      </View>
    );
  }, []);

  const contentContainerStyle = useMemo(() => {
    if (data?.length) {
      return {};
    }

    return {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    };
  }, [data]);
  if (isError) {
    return (
      <ErrorScreenContainer queryKey={KEYWORDS.ANNOUNCEMENTS.base}>
        <Text>ERROR</Text>
      </ErrorScreenContainer>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => handleRefresh()}
            />
          }
          data={data}
          contentContainerStyle={contentContainerStyle as ViewStyle}
          ListEmptyComponent={renderEmpty()}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return `${item.id}-${item?.to}"}`;
          }}
        />
      )}
    </View>
  );
};

export default AnnoucementsScreen;
