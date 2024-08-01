import { useState } from "react";
import { Dialog, Text, useTheme } from "@rneui/themed";
import { Button } from "@/components/ui/Button";
import { View } from "@/components/ui/View";

export type ErrorDialogProps = {
  title: string;
  description: string;
};

export const ErrorDialog = ({ title, description }: ErrorDialogProps) => {
  const { theme } = useTheme();
  const [show, setShow] = useState(true);
  if (!show) {
    return null;
  }
  return (
    <Dialog>
      <Dialog.Title title={title} />
      <Text>{description}</Text>
      <Dialog.Actions>
        <Button onPress={() => setShow(false)} title="Close" />
      </Dialog.Actions>
    </Dialog>
  );
};
