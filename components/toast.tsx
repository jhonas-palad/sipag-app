import { toast } from "sonner-native";
import { Icon, useTheme } from "@rneui/themed";
type ToastProps = {
  message: string;
  description?: string;
};

export const useToastVariants = () => {
  const { theme } = useTheme();
  return {
    error({ message, description }: ToastProps) {
      toast(message, {
        description,
        styles: {
          title: { color: theme.colors.error },
        },
        icon: <Icon name="error" color={theme.colors.error} />,
      });
    },
    success({ message, description }: ToastProps) {
      toast(message, {
        description,
        styles: {
          title: { color: theme.colors.success },
        },
        icon: <Icon name="task-alt" color={theme.colors.success} />,
      });
    },
  };
};
