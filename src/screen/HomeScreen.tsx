import { View, Text, StyleSheet, TouchableNativeFeedback, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getAccountType } from "../utils/getStorageData";
import { Scanner, Ticket, Fastpass, Checkinout } from "../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { dateFormat } from "../utils/dateFormat";
import getURL from "../utils/getURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import CheckinIcon from "../../assets/SvgPic/Entrance.svg";

//Svg
const checkinPic = require("../../assets/SvgPic/Entrance.svg");

const HomeScreen = () => {
    const navigation: any = useNavigation();
    const [types, setTypes] = useState("");
    const [fullname, setFullname] = useState("");
    const [picture, setPicture] = useState("");
    const [token, setToken] = useState("");

    const fetchImg = () =>
        fetch(getURL() + "profilepic", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        }).then(async (response) => {
            const picture: string = await response.text();
            // console.log(picture);
            return picture;
        });

    useEffect(() => {
        getAccountType("token").then((getToken: string | null) => {
            if (getToken) {
                setToken(getToken);
            }
        });
        getAccountType("fullname").then((getFullname: string | null) => {
            if (getFullname) {
                setFullname(getFullname);
            }
        });
        getAccountType("types").then((getTypes: string | null) => {
            if (getTypes) {
                const thaiTypes =
                    getTypes === "พนักงานตรวจสอบบัตรผ่านประตู" ? getTypes : `พนักงานประจำเครื่องเล่น${getTypes}`;
                setTypes(thaiTypes);
            }
        });
    }, []);

    useEffect(() => {
        if (token === "") return;
        fetchImg().then((picture: string) => {
            setPicture(picture);
        });
    }, [token]);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50, backgroundColor: "white" }}>
            <View style={{ flex: 1, rowGap: 10 }}>
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        marginLeft: 40,
                        marginRight: 40,
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: "600" }}>QueueTix</Text>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 15 }}>{dateFormat(new Date())}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginLeft: 40, alignItems: "center", marginTop: 15 }}>
                    <View
                        style={{
                            width: 75,
                            height: 75,
                            borderRadius: 75 / 2,

                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {picture !== "" && <Image style={styles.profilePic} source={{ uri: picture }} />}
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 10, rowGap: 5 }}>
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>{fullname}</Text>
                        <Text style={{ fontSize: 15, color: "#3E3D3D" }}>{types}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 4.5, rowGap: 15 }}>
                <Text style={{ fontSize: 20, marginLeft: 40, fontWeight: "600" }}>Menu</Text>
                <View style={{ flexDirection: "row", width: "100%", height: "27%", columnGap: 10 }}>
                    {types === "พนักงานตรวจสอบบัตรผ่านประตู" ? (
                        <>
                            <TouchableNativeFeedback
                                onPress={() => {
                                    navigation.navigate("Scanner");
                                }}
                            >
                                <View style={[styles.button_Ticket, , { marginLeft: 40 }]}>
                                    <View
                                        style={[
                                            styles.content_Ticket,
                                            { borderColor: "#1dc756", backgroundColor: "#b1f1bc" },
                                        ]}
                                    >
                                        <Checkinout size={50} color="#1dc756" />
                                    </View>
                                    <View style={{ alignItems: "flex-start" }}>
                                        <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Check In</Text>
                                        <Text style={{ fontSize: 14, fontWeight: "500", marginTop: 5 }}>
                                            Scan for Entrance amusement
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                onPress={() => {
                                    navigation.navigate("ScannerOut");
                                }}
                            >
                                <View style={styles.button_Ticket}>
                                    <View
                                        style={[
                                            styles.content_Ticket,
                                            { borderColor: "#dc4444", backgroundColor: "#f1b1b1" },
                                        ]}
                                    >
                                        <Checkinout size={50} color="#dc4444" />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Check Out</Text>
                                        <Text style={{ fontSize: 14, fontWeight: "500", marginTop: 5 }}>
                                            Scan for Exit amusement
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    ) : (
                        <>
                            <TouchableNativeFeedback onPress={() => navigation.navigate("Rides")}>
                                <View style={[styles.button_Ticket, { marginLeft: 40 }]}>
                                    <View style={[styles.content_Fastpass, { backgroundColor: "#F3C95B" }]}>
                                        <Fastpass size={50} color="white" />
                                    </View>
                                    <View style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Rides</Text>
                                        <Text style={{ fontSize: 14, fontWeight: "500", marginTop: 5 }}>
                                            Scan Ticket
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => navigation.navigate("Fastpass")}>
                                <View style={[styles.button_Ticket]}>
                                    <View style={[styles.content_Fastpass, { backgroundColor: "#1dc756" }]}>
                                        <Fastpass size={50} color="white" />
                                    </View>
                                    <View style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Fastpass</Text>
                                        <Text style={{ fontSize: 14, fontWeight: "500", marginTop: 5 }}>
                                            Scan Ticket Fastpass
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    )}
                </View>
                <TouchableNativeFeedback onPress={() => navigation.navigate("Ticket")}>
                    <View style={[styles.button_Queue, { marginLeft: 40 }]}>
                        <View style={[styles.content_Ticket, { backgroundColor: "#897FFF" }]}>
                            <Ticket size={50} color="white" />
                        </View>
                        <View style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 4 }}>
                            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Ticket</Text>
                            <Text style={{ fontSize: 14, fontWeight: "500", marginTop: 5 }}>Read Ticket Data</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={() => {
                        AsyncStorage.removeItem("token").then(() => {
                            navigation.replace("Login");
                        });
                    }}
                >
                    <View
                        style={{
                            alignSelf: "center",
                            marginTop: 50,
                            backgroundColor: "#210066",
                            width: "80%",
                            height: "8%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 20 }}>Log Out</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button_Scanner: {
        width: "40%",
        height: "25%",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderColor: "#210066",
        borderWidth: 2,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 40,
    },
    profilePic: {
        resizeMode: "contain",
        width: 60,
        height: 60,
    },
    content_Scanner: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        borderColor: "#F16B4E",
        borderWidth: 4,
        backgroundColor: "#FEC4C4",
        alignItems: "center",
        justifyContent: "center",
    },
    button_Ticket: {
        width: "38.7%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderColor: "#210066",
        borderWidth: 2,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    content_Ticket: {
        width: 80,
        height: 80,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    content_Fastpass: {
        width: 80,
        height: 80,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    button_Queue: {
        width: "80%",
        height: "25%",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderColor: "#210066",
        borderWidth: 2,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 40,
    },
    content_Queue: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        borderColor: "#F3C95B",
        borderWidth: 4,
        backgroundColor: "#FCE6AD",
        alignItems: "center",
        justifyContent: "center",
    },
    pic: {
        width: 70,
        height: 70,
    },
});
export default HomeScreen;
