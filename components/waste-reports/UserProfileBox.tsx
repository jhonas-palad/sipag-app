import { StyleSheet, Text } from "react-native";
import { View } from "../ui/View";
import { Avatar, useTheme } from "@rneui/themed";
import React, { useMemo } from "react";
import { User } from "@/types/user";

export const UserProfileBox = ({ profile }: { profile: User }) => {
  const { theme } = useTheme();
  const photo = useMemo(() => profile.photo ?? "", [profile.photo]);
  const fullName = useMemo(
    () => `${profile?.first_name ?? "?"} ${profile?.last_name ?? "?"}`,
    [profile?.first_name, profile?.last_name]
  );
  const contact = useMemo(() => {
    return profile?.phone_number ?? profile?.email;
  }, [profile?.phone_number, profile?.email]);
  return (
    <View
      transparent
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Avatar
        size={52}
        rounded
        title={!photo ? "?" : undefined}
        source={
          photo
            ? {
                uri: photo?.img_file,
              }
            : undefined
        }
        containerStyle={{
          borderColor: "grey",
          borderStyle: "solid",
          borderWidth: 0.5,
        }}
      />
      <View transparent>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{fullName}</Text>
        <Text style={{ color: theme.colors.grey1 }}>{contact}</Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({});
