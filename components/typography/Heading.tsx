import { Text, StyleSheet } from "react-native";
import React from "react";

type Props = {} & React.PropsWithChildren;

export const Heading1 = ({ children }: Props) => {
  return <Text style={styles.heading}>{children}</Text>;
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 48,
    fontWeight: "600",
  },
});
