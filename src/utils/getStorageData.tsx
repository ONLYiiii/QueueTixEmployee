import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAccountType(data: string) {
    const getData = await AsyncStorage.getItem(data);
    return getData;
}

export async function deleteToken(data: string) {
    await AsyncStorage.removeItem(data);
    return;
}
