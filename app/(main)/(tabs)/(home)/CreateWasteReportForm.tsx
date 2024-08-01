import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Text, useTheme } from "@rneui/themed";
import { useForm } from "react-hook-form";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pressable } from "react-native";
import { pickImage } from "@/lib/images/pick-image";
import { useState } from "react";
import { Image } from "@rneui/themed";
export const CreateWasteReportForm = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>("");
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });
  const handlePickImage = async () => {
    const res = await pickImage();
    if (res.error) {
      console.log(res.error);
    }
    console.log(res);
    setImage(res.result?.uri as string);
  };

  return (
    <Form {...form}>
      <View
        style={{
          justifyContent: "space-between",
          height: "100%",
          paddingBottom: 40,
        }}
      >
        <View>
          <View transparent style={[styles.fieldSpace, { marginTop: 16 }]}>
            <Pressable
              onPress={handlePickImage}
              style={{
                // borderStyle: "dashed",
                // borderWidth: 1,
                // borderColor: theme.colors.greyOutline,
                marginHorizontal: 8,
                height: 150,
                backgroundColor: theme.colors.grey5,
                borderRadius: theme.spacing.lg,
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              {image ? (
                <Image style={styles.imageStyle} source={{ uri: image }} />
              ) : (
                <>
                  <Text
                    h4
                    style={{ color: theme.colors.grey0, marginBottom: 8 }}
                  >
                    Upload a photo
                  </Text>
                  <Text style={{ color: theme.colors.grey0 }}>
                    Just tap here to browse you gallery to upload photo
                  </Text>
                </>
              )}
            </Pressable>
          </View>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem>
                  <View
                    transparent
                    style={[styles.fieldSpace, { marginTop: 16 }]}
                  >
                    <Input
                      label="Title"
                      onChangeText={field.onChange}
                      placeholder="Type here..."
                      ErrorComponent={() => <FormMessage />}
                      {...field}
                    />
                  </View>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <TextArea
                  numberOfLines={6}
                  maxLength={10}
                  label="description"
                  placeholder="Write report description..."
                  ErrorComponent={() => <FormMessage />}
                  asFormItem
                  {...field}
                  onChangeText={field.onChange}
                />
              );
            }}
          />
        </View>
        <Button size="lg" radius="lg">
          Submit
        </Button>
      </View>
    </Form>
  );
};

const styles = StyleSheet.create({
  fieldSpace: {
    // marginBottom: 16,
  },
  imageStyle: {
    height: 150,
    width: "100%",
    objectFit: "contain",
  },
});
