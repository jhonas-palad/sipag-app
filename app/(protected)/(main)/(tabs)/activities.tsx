import { FlatList, ActivityIndicator, ViewStyle } from "react-native";
import React, { useCallback, useMemo } from "react";
import { Avatar, useTheme } from "@rneui/themed";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import {
  useWasteReportActivities,
  WasteReportActivitiesQuery,
  WASTE_REPORT_ACTIVITIES,
} from "@/data/waste-reports";
import ErrorScreenContainer from "@/components/ErrorScreenContainer";
import { Image } from "expo-image";
import { dateFormat } from "@/utils/date";
import { User } from "@/types/user";
type Props = {};

const ActivitiesScreen = (props: Props) => {
  const { theme } = useTheme();
  const { data, error, isFetching, isLoading } =
    useWasteReportActivities() as WasteReportActivitiesQuery;
  const getFullName = useCallback((user: User) => {
    let fullName = "";
    if (user.first_name) {
      fullName = fullName + user.first_name + " ";
    } else {
      fullName = fullName + "<No Fname> ";
    }

    if (user.last_name) {
      fullName = fullName + user.last_name;
    } else {
      fullName = fullName + "<No Lname>";
    }

    return fullName;
  }, []);
  const renderItem = useCallback(
    ({ item }: any) => {
      let activity_phrase;
      switch (item.activity) {
        case "ADDED_POST":
          activity_phrase = "has added a new waste post";
          break;
        case "ACCEPT_POST":
          activity_phrase = "has accepted a the posted waste";
          break;
        case "CANCEL_TASK":
          activity_phrase = "has cancelled the posted waste";
          break;
        case "FINISH_TASK":
          activity_phrase = "has cleanup the posted waste";
          break;
        default:
          activity_phrase = "<->";
          break;
      }
      const ts = dateFormat(item.activity_timestamp, "PPpp");
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
            title={item.user.photo !== null ? undefined : "?"}
          >
            {item.user.photo !== null && (
              <Image
                contentFit="cover"
                style={{ width: "100%", height: "100%", borderRadius: 50 }}
                placeholder={item.user.photo.hash}
                source={{ uri: item.user.photo.img_file }}
              />
            )}
          </Avatar>
          <View transparent style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>
              {getFullName(item.user)} <Text>{activity_phrase}</Text>{" "}
              {!item.post ? (
                "Deleted post"
              ) : (
                <>
                  {item.post.title} <Text>by</Text>{" "}
                  {getFullName(item.post.posted_by)}
                </>
              )}
            </Text>
            <Text style={{ color: theme.colors.grey0 }}>{ts}</Text>
          </View>
          <View>
            {item.post && (
              <Image
                contentFit="cover"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.spacing.md,
                }}
                placeholder={item.post.thumbnail.hash}
                source={{ uri: item.post.thumbnail.img_file }}
              />
            )}
          </View>
        </View>
      );
    },
    [getFullName, theme]
  );

  const renderEmpty = useCallback(() => {
    return (
      <View transparent>
        <Text h4>No activities at the moment 🌿</Text>
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
  if (error) {
    return (
      <ErrorScreenContainer queryKey={WASTE_REPORT_ACTIVITIES}>
        <Text>ERROR</Text>
      </ErrorScreenContainer>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {isFetching || isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={data}
          contentContainerStyle={contentContainerStyle as ViewStyle}
          ListEmptyComponent={renderEmpty()}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item.id;
          }}
        />
      )}
    </View>
  );
};

export default ActivitiesScreen;
