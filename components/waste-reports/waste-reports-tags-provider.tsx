import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useMemo, useState } from "react";
import { Button } from "@rneui/themed";

interface WasteReportsTagContextP {
  tag: string;
  tags: string[];
  selectTag: (tag: string) => void;
}
export const WasteReportsTagContext =
  React.createContext<WasteReportsTagContextP | null>(null);
type Props = {
  children: React.ReactNode;
};

const WasteReportsTagsProvider = (props: Props) => {
  const tags = useMemo(() => {
    return ["all", "pending", "available", "cleared", "myposts"];
  }, []);
  const [tag, setTag] = useState(tags[0]);

  const handleSelectTag = (tag: string) => {
    if (!tags.includes(tag)) {
      return;
    }
    setTag(tag);
  };
  return (
    <WasteReportsTagContext.Provider
      value={{ tag, tags, selectTag: handleSelectTag }}
    >
      {props.children}
    </WasteReportsTagContext.Provider>
  );
};

export const useWasteReportsTags = () => {
  const res = useContext(WasteReportsTagContext);
  if (!res) {
    throw new Error(
      "useWasteReportsTags must be used within a WasteReportsTagsProvider"
    );
  }
  return res;
};
export const Tag = ({ name }: { name: string }) => {
  const { tag, selectTag } = useWasteReportsTags();
  return (
    <Button
      type={tag === name ? "solid" : "outline"}
      size="md"
      radius="lg"
      onPress={() => selectTag(name)}
      title={name}
      containerStyle={{ marginHorizontal: 4 }}
    />
  );
};
export default WasteReportsTagsProvider;
