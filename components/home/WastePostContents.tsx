import { useLayoutEffect } from "react";
import { type UserPost } from "@/types/user";
import { useTabFeedSheetStore } from "@/store/tabfeed-sheet";
import { useTheme } from "@rneui/themed";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View } from "../ui/View";
import { Image } from "expo-image";
import { Text, Avatar, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

export const WastePostContent = ({ detail }: { detail: UserPost }) => {
  const hideTab = useTabFeedSheetStore((state) => state.hideTab);
  const showTab = useTabFeedSheetStore((state) => state.showTab);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    hideTab();
    return () => {
      showTab();
    };
  }, []);
  return (
    <>
      <BottomSheetScrollView>
        <View
          style={{
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={[{ paddingHorizontal: 16, gap: 16 }]}>
            <View
              style={{
                position: "relative",
                shadowColor: theme.colors.black,
                borderRadius: 16,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Image
                style={{
                  height: 300,
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: 16,
                }}
                placeholder={{ blurhash: "LmDmXQD*IUs-_4M{RPjsWVs:f+R*" }}
                cachePolicy="none"
                source={{
                  uri: "https://picsum.photos/200/300?random=2" as string,
                }}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                start={{ x: 0, y: 0.1 }}
                end={{ y: 1, x: 0 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  padding: 12,
                  width: "100%",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
                }}
              >
                <View
                  transparent
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Avatar
                    size={40}
                    rounded
                    title={detail.user.firstName[0] + detail.user.lastName[0]}
                    containerStyle={{ backgroundColor: theme.colors.error }}
                  />
                  <View transparent>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: theme.colors.white,
                      }}
                    >
                      {detail.user.firstName} {detail.user.lastName}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "light",
                        fontSize: 12,
                        color: theme.colors.white,
                      }}
                    >
                      August 10, 2024
                    </Text>
                  </View>
                </View>
                <View></View>
              </LinearGradient>
            </View>
            <View
              style={{
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,

                elevation: 1,

                padding: 16,
                borderRadius: 16,
                flexDirection: "row",
                gap: 16,
              }}
            >
              <Icon name="flag" size={20} color={theme.colors.warning} />
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.grey3,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                122 Sala Tanauan City, Batangas
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: theme.colors.grey2 }}>
              {detail.description}
              {detail.description}
              {detail.description}
            </Text>
            <Text h4 style={{ fontWeight: "600", color: theme.colors.black }}>
              Contact Details
            </Text>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View
                style={{
                  flex: 1,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,

                  elevation: 1,

                  padding: 16,
                  borderRadius: 16,
                }}
              >
                <Icon name="phone" size={20} color={theme.colors.warning} />
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.grey3,
                    textAlign: "left",
                  }}
                >
                  +63 939-496-1849
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,

                  elevation: 1,

                  padding: 16,
                  borderRadius: 16,
                }}
              >
                <Icon name="mail" size={20} color={theme.colors.warning} />
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors.grey3,
                  }}
                >
                  jhonasemmanuel.palad@cebupacificair.com
                </Text>
              </View>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </>
  );
};
