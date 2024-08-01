import { useLayoutEffect } from "react";
import { type UserPost } from "@/types/user";
import { useToggleHideTab } from "@/store/tab";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@rneui/themed";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View } from "../ui/View";
import { Image } from "expo-image";
import { Text, Avatar, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { ListItem } from "@rneui/themed";

export const WastePostContent = ({ detail }: { detail: UserPost }) => {
  const setTabHide = useToggleHideTab(useShallow((state) => state.setTabHide));
  const { theme } = useTheme();

  useLayoutEffect(() => {
    setTabHide(true);
    return () => {
      setTabHide(false);
    };
  }, []);
  return (
    <>
      <BottomSheetScrollView>
        <View
          style={{
            paddingTop: 16,
            paddingBottom: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageGradientUser {...detail} />

          <View style={[{ gap: 16 }]}>
            <ListItem
              bottomDivider
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon
                name="location-pin"
                size={20}
                color={theme.colors.secondary}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Landmark
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>Near bahay na pula</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem
              bottomDivider
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon name="description" size={20} color={theme.colors.grey3} />
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Description
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  {detail.description}
                  {detail.description}
                  {detail.description}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem
              bottomDivider
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon name="call" size={20} color={theme.colors.grey3} />
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Phone number
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>0939496189</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem

              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icon name="mail" size={20} color={theme.colors.grey3} />
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Email
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>jhonasemmanuel</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </View>
        </View>
      </BottomSheetScrollView>
    </>
  );
};

const ImageGradientUser = (detail: UserPost) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <Image
        style={{
          height: 200,
          width: "100%",
          objectFit: "contain",
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
  );
};
