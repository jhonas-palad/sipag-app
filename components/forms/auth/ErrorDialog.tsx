import { useState } from "react";
import { Dialog, Text } from "@rneui/themed";
import { Button } from "@/components/ui/Button";

export type ErrorDialogProps = {
  title: string;
  description: string;
};

export const ErrorDialog = ({ title, description }: ErrorDialogProps) => {
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
