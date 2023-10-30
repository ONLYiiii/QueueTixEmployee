import { View, Text, StyleSheet, Image, FlatList, TouchableHighlight, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import Constants from "expo-constants";
import picdata from "../interface/picdata";
import { useNavigation } from "@react-navigation/native";
import rides from "../utils/FetchData/rides";

const QueueScreen = () => {
    const navigation: any = useNavigation();
    // const [picdata, setPicdata]: [picdata[] | undefined, Dispatch<SetStateAction<picdata[] | undefined>>] = useState();

    // useEffect(() => {
    //     rides().then((data) => {
    //         setPicdata(data);
    //     });
    // }, []);
    const picdata: picdata[] = [
        {
            rideId: 1,
            Engname: "SkyCoaster",
            ThaiName: "สกายโคสเตอร์",
            src: require("../../assets/RidesFastpass/SkyCoaster.png"),
        },
        {
            rideId: 2,
            Engname: "Tornado",
            ThaiName: "ทอร์นาโด",
            src: require("../../assets/RidesFastpass/Tornado.png"),
        },
        {
            rideId: 3,
            Engname: "SuperSplash",
            ThaiName: "ซูเปอร์สแปลช",
            src: require("../../assets/RidesFastpass/SuperSplash.png"),
        },
        {
            rideId: 4,
            Engname: "BumpCar",
            ThaiName: "รถบั๊มมหาสนุก",
            src: require("../../assets/RidesFastpass/BumpCar.png"),
        },
        {
            rideId: 5,
            Engname: "GrandCanyon",
            ThaiName: "แกรนด์แคนยอน",
            src: require("../../assets/RidesFastpass/GrandCanyon.png"),
        },
        {
            rideId: 6,
            Engname: "BlackHoleCoaster",
            ThaiName: "แบล็กโฮล โคสเตอร์",
            src: require("../../assets/RidesFastpass/BlackHoleCoaster.png"),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ alignSelf: "center", fontSize: 24, fontWeight: "600" }}>Queue Fastpass</Text>
            <FlatList
                data={picdata}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <>
                            <TouchableOpacity
                                activeOpacity={0.2}
                                onPress={() => {
                                    navigation.navigate("Total", { item: item });
                                }}
                            >
                                <Image style={styles.imageThumbnail} source={item.src} resizeMode="contain" />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", rowGap: 5 }}>
                                <Text>{item.Engname}</Text>
                                <Text>{item.ThaiName}</Text>
                            </View>
                        </>
                    </View>
                )}
                //Setting the number of column
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
};

export default QueueScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        paddingTop: 50,
    },
    imageThumbnail: {
        justifyContent: "center",
        alignItems: "center",
        height: 190,
        width: 190,
        marginTop: 20,
        alignSelf: "center",
    },
});
