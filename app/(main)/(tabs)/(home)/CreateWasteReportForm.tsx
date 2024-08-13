import { useCallback, useEffect } from "react";

import { StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { Text, useTheme, LinearProgress, Icon } from "@rneui/themed";
import { useForm } from "react-hook-form";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Input, TextArea } from "@/components/ui/Input";
import { View } from "@/components/ui/View";
import { Button } from "@/components/ui/Button";
import { BottomWrapper } from "@/components/BottomWrapper";

import { usePickImage } from "@/lib/images/pick-image";

import { useLatLngStore } from "@/store/store-latlng";

import { useShallow } from "zustand/react/shallow";

import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import {
  WasteReportSchema,
  type WasteReportSchemaT,
} from "@/schemas/waste-report";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateReportPost } from "@/data/waste-reports";
import { NON_FIELD_ERROR, ERR_DETAIL } from "@/constants/response-props";
import { ResponseError } from "@/errors/response-error";
import { useAuthSession } from "@/store/auth";
import Toast from "react-native-simple-toast";

export const CreateWasteReportForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { latitude, longitude, setLatLng } = useLatLngStore(
    useShallow((state) => ({
      latitude: state.latitude,
      longitude: state.longitude,
      setLatLng: state.setLatLng,
    }))
  );
  const form = useForm<WasteReportSchemaT>({
    resolver: zodResolver(WasteReportSchema),
    defaultValues: {
      title: "",
      description: "",
      image: {},
      location: {
        longitude: longitude,
        latitude: latitude,
      },
    },
  });
  useEffect(() => {
    if (longitude !== null) {
      form.setValue("location.longitude", longitude);
      form.clearErrors("location");
    }
    if (latitude !== null) {
      form.setValue("location.latitude", latitude);
    }
    return () => {
      setLatLng({ latitude: null, longitude: null });
    };
  }, [longitude, latitude]);

  const { mutateAsync: postWasteReport, isPending: postPending } =
    useCreateReportPost({
      async onError(error, variables, context) {
        let errMsg = "Form is invalid";

        if (error instanceof ResponseError) {
          const errors = error.errors;
          Object.keys(errors!).forEach((err_field: string) => {
            let key = err_field;
            if (NON_FIELD_ERROR === err_field || ERR_DETAIL === err_field) {
              key = "root";
            }
            if ("user_id" === err_field) {
              errMsg = "Please authenticate first before proceeding.";
            }
            form.setError(key as keyof WasteReportSchemaT, {
              message: errors?.[err_field],
            });
          });
          if (error.status === 401) {
            errMsg = "Session Expired";
            router.replace("/auth");
          }
          if (error.status >= 500) {
            errMsg = "Internal Server Error. Please try again later.";
          }
        } else {
          errMsg = (error as Error)?.message as string;
        }
        form.setError("root", {
          message: errMsg,
        });
        Toast.show(errMsg, Toast.LONG);
      },
      async onSuccess(data) {
        router.dismissAll();
      },
    });
  const { mutateAsync, isPending } = usePickImage({
    onSuccess(data) {
      form.setValue("image", {
        url: data.uri,
        mimeType: data.mimeType as string,
        fileName: data.fileName as string,
      });
    },
  });
  const handlePickImage = useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);

  const handleSubmit = useCallback(
    form.handleSubmit(async (formData: WasteReportSchemaT) => {
      //@ts-ignore
      await postWasteReport(formData);
    }),
    [form]
  );
  return (
    <Form {...form}>
      <ScrollView>
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
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
                      type="clear"
                      // label="Title"
                      inputStyle={{ fontWeight: "600" }}
                      onChangeText={field.onChange}
                      placeholder="Enter title here..."
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
                  inputStyle={{ paddingHorizontal: 0 }}
                  type="clear"
                  maxLength={1000}
                  // label="description"
                  placeholder="Type report description..."
                  ErrorComponent={() => <FormMessage />}
                  asFormItem
                  {...field}
                  onChangeText={field.onChange}
                />
              );
            }}
          />
        </View>
        <View
          transparent
          style={{ marginHorizontal: 16, marginBottom: 16, gap: 24 }}
        >
          <FormField
            name="image"
            control={form.control}
            render={({ field, fieldState }) => {
              console.log(fieldState.error, "asd");
              return (
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 4,
                  }}
                >
                  {field.value.url ? (
                    <Image
                      source={field.value.url}
                      style={{ width: "100%", height: 300 }}
                    />
                  ) : (
                    <>
                      <Button type="clear" onPress={handlePickImage} size="sm">
                        <Icon name="image" color={theme.colors.grey0} />
                        <Text
                          style={{ fontSize: 18, color: theme.colors.grey0 }}
                        >
                          Select an image
                        </Text>
                      </Button>
                      <FormMessage>
                        {fieldState.error ? "Please upload an image" : null}
                      </FormMessage>
                    </>
                  )}
                </View>
              );
            }}
          />

          <FormField
            name="location"
            control={form.control}
            render={({ fieldState }) => {
              return (
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 4,
                  }}
                >
                  <Link href="/choose-location" asChild>
                    <Button size="sm" type="clear">
                      <Icon name="location-on" color={theme.colors.grey0} />
                      <Text style={{ fontSize: 18, color: theme.colors.grey0 }}>
                        {form.getValues("location.latitude") ||
                        form.getValues("location.longitude")
                          ? [
                              form.getValues("location.latitude"),
                              form.getValues("location.longitude"),
                            ].join(",")
                          : "Pin a location"}
                      </Text>
                    </Button>
                  </Link>
                  <FormMessage />
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <KeyboardAvoidingView behavior="height">
        <View
          style={{
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <Button
            title="Submit"
            onPress={handleSubmit}
            buttonStyle={{ alignSelf: "flex-end" }}
          />
        </View>

        {(isPending || postPending) && !form.formState.isDirty && (
          <LinearProgress variant="indeterminate" color="blue" />
        )}
        <BottomWrapper>
          <Button onPress={handlePickImage} type="clear" size="sm">
            <Icon name="image" size={24} />
          </Button>
          <Link href="/choose-location" asChild>
            <Button type="clear" size="sm">
              <Icon name="map" size={24} />
            </Button>
          </Link>
        </BottomWrapper>
      </KeyboardAvoidingView>
    </Form>
  );
};

const styles = StyleSheet.create({
  fieldSpace: {
    // marginBottom: 16,
  },
  imageStyle: {
    height: 300,
    width: "100%",
    objectFit: "cover",
  },
});
