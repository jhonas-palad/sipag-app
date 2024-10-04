import { View, ViewSafe } from "@/components/ui/View";
import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { Tab, TabView, useTheme, Text } from "@rneui/themed";
import { useInvalidateQuery } from "@/hooks/queries/useRefreshQuery";
import { KEYWORDS } from "@/lib/constants";
import { useGetCleanerPoints } from "@/hooks/queries/useGetCleanerPoints";
import { FAB } from "@/components/ui/FAB";
import { HistoryTabView } from "@/components/points/history-view";
import { AccomplishedWasteReportView } from "@/components/points/accomplished-waste-reports-view";
type Props = {};

const Points = (props: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [index, setIndex] = React.useState(0);

  const { data: cleanerPoints, isLoading: isLoadingCleanerPoints } =
    useGetCleanerPoints();

  const handleRefreshCleanerPoints = useInvalidateQuery({
    queryKey: [KEYWORDS.CLEANER_POINTS],
  });

  return (
    <ViewSafe style={{ flex: 1 }}>
      {/* <View transparent> */}
      <FAB
        size="small"
        style={{
          justifyContent: "flex-start",
          paddingTop: 24,
          paddingHorizontal: 24,
        }}
        buttonStyle={{
          backgroundColor: "white",
        }}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
        icon={{ name: "arrow-back" }}
      />

      <View
        style={{
          backgroundColor: theme.colors.white,
          margin: 20,
          padding: 14,
          borderRadius: theme.spacing.lg,
          elevated: 10,
          shadowColor: theme.colors.grey0,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}
      >
        <Text h2>SIPAG</Text>
        {isLoadingCleanerPoints ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <View
            transparent
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View transparent>
              <Text h4>Current Points: {cleanerPoints.count}</Text>
              <Text style={{ color: theme.colors.grey3 }}>Max points: 10</Text>
            </View>
            <FAB
              size="small"
              containerStyle={{
                elevation: 0,
                shadowOpacity: 0,
              }}
              buttonStyle={{
                backgroundColor: "transparent",
              }}
              onPress={() => handleRefreshCleanerPoints}
              icon={{ name: "sync" }}
            />
          </View>
        )}
      </View>

      <Tab
        onChange={(e) => setIndex(e)}
        variant="default"
        style={{ width: "100%" }}
        indicatorStyle={{
          display: "none",
          // backgroundColor: theme.colors.primary,
        }}
        buttonStyle={(active) => ({
          borderBottomWidth: active ? 2 : 0,
          borderColor: active ? theme.colors.primary : theme.colors.grey1,
        })}
        titleStyle={(active) => ({
          color: active ? theme.colors.primary : theme.colors.grey1,
        })}
        value={index}
      >
        <Tab.Item title="Accomplished tasks" />
        <Tab.Item title="History" />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={[style.tabView]}>
          <AccomplishedWasteReportView />
        </TabView.Item>
        <TabView.Item style={[style.tabView]}>
          <HistoryTabView />
        </TabView.Item>
      </TabView>
      {/* </View> */}
    </ViewSafe>
  );
};

export default Points;

const style = StyleSheet.create({
  tabView: {
    width: "100%",
    // alignItems: "center",
  },
});
