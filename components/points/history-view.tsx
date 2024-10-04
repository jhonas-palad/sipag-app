import { useGetRedeemHistory } from "@/hooks/queries/useGetRedeemHistory";
import { useTheme, Text, Icon } from "@rneui/themed";
import { ActivityIndicator, RefreshControl } from "react-native";
import { View } from "../ui/View";
import { FlatList } from "react-native-gesture-handler";
import { KEYWORDS } from "@/lib/constants";
import { useInvalidateQuery } from "@/hooks/queries/useRefreshQuery";
function HistoryTabView() {
  const { theme } = useTheme();
  const { data: redeemHistories, isLoading: isLoadingRedeemHistory } =
    useGetRedeemHistory();
  const handleRefreshRedeemHistory = useInvalidateQuery({
    queryKey: [KEYWORDS.REDEEM_HISTORY],
  });
  return (
    <View transparent>
      {isLoadingRedeemHistory ? (
        <ActivityIndicator size="small" />
      ) : redeemHistories.length ? (
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={() => handleRefreshRedeemHistory()}
              refreshing={isLoadingRedeemHistory}
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
                <Icon name="redeem" color={theme.colors.success} />
                <Text>Claimed at {item.claimed_date}</Text>
              </View>
            );
          }}
          data={redeemHistories}
        />
      ) : (
        <Text>No redeem history yet</Text>
      )}
    </View>
  );
}

export { HistoryTabView };
