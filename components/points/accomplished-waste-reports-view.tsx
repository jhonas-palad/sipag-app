import { useTheme, Text, Icon } from "@rneui/themed";
import { ActivityIndicator, RefreshControl } from "react-native";
import { View } from "../ui/View";
import { FlatList } from "react-native-gesture-handler";
import { KEYWORDS } from "@/lib/constants";
import { Image } from "expo-image";
import { useInvalidateQuery } from "@/hooks/queries/useRefreshQuery";
import { useGetAccomplishedWasteReports } from "@/hooks/queries/useGetAccomplishedWasteReports";
function AccomplishedWasteReportView() {
  const { theme } = useTheme();
  const {
    data: accomplishedWasteReports,
    isLoading: isAccomplishedWasteReports,
  } = useGetAccomplishedWasteReports();
  const handleRefreshAccomplishedWasteReports = useInvalidateQuery({
    queryKey: [KEYWORDS.ACCOMPLISHED_WASTE_REPORTS],
  });
  return (
    <View transparent>
      {isAccomplishedWasteReports ? (
        <ActivityIndicator size="small" />
      ) : accomplishedWasteReports.length ? (
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={() => handleRefreshAccomplishedWasteReports()}
              refreshing={isAccomplishedWasteReports}
            />
          }
          renderItem={({ item }) => {
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
                <Icon name="star" size={24} color="gold" />
                <View transparent style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 18, fontWeight: "bold" }}
                  >
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={{ fontSize: 16 }}>
                    {item.description}
                  </Text>
                  <Text style={{ color: theme.colors.grey0 }}>
                    {item.completed_at}
                  </Text>
                </View>
                <View>
                  <Image
                    contentFit="cover"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: theme.spacing.md,
                    }}
                    placeholder={item.thumbnail.hash}
                    source={{ uri: item.thumbnail.img_file }}
                  />
                </View>
              </View>
            );
          }}
          data={accomplishedWasteReports}
        />
      ) : (
        <Text>No accomplished waste reports yet</Text>
      )}
    </View>
  );
}

export { AccomplishedWasteReportView };
