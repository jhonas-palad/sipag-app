import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HomeTabs } from "@/navigations/tabs/HomeTabs";

type Props = {};

const TabsLayout = (props: Props) => {
  return (
    <>
      
        <HomeTabs />

    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
