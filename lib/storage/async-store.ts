import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, value);
};

export const getStoreData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (value !== null) {
    // value previously stored
  }
};
