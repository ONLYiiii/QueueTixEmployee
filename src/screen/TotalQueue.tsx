import { View, Text, Image, StyleSheet, FlatList, SafeAreaView } from "react-native";
import React from "react";
import Constants from "expo-constants";

import { useRoute } from "@react-navigation/native";
import TimeFastpass from "../interface/TimeFastpass";
import FastpassRound from "../json/FastpassRound.json";
import picdata from "../interface/picdata";

const TotalQueue = () => {
    const route: any = useRoute();
    const rideData: picdata = route.params.item;

    const thisTimeRound: TimeFastpass[] = FastpassRound.filter((item) => item.rideId === rideData.rideId);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50, backgroundColor: "white" }}>
            <Text style={{ fontSize: 24, fontWeight: "500", alignSelf: "center" }}>TotalQueue</Text>
            <Image style={styles.imageThumbnail} source={rideData.src} resizeMode="contain" />
            <Text style={styles.Nameride}>
                {rideData.Engname} - {rideData.ThaiName}{" "}
            </Text>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 10 }}>Time</Text>
                <FlatList
                    data={thisTimeRound}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "white",
                                width: "28%",
                                height: 58,
                                margin: 10,
                                marginRight: 4,
                                borderWidth: 1.5,
                                borderColor: "#000000",
                                borderRadius: 4,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text>
                                {item.TimeStart} - {item.TimeEnd}
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text> </Text>
                                <Text> / </Text>
                                <Text style={{ color: "red" }}>{item.MaxSeat}</Text>
                            </View>
                        </View>
                    )}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    ImageRide: {
        width: "55%",
        height: "25%",
        alignSelf: "center",
        borderRadius: 8,
        marginTop: 20,
    },
    imageThumbnail: {
        justifyContent: "center",
        alignItems: "center",
        height: 190,
        width: 190,
        alignSelf: "center",
    },
    Nameride: {
        fontSize: 18,
        fontWeight: "500",
        alignSelf: "center",
    },
    rideName: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 40,
        paddingTop: 20,
    },
});
export default TotalQueue;
