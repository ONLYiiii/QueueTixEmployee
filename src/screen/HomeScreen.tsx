import { View, Text, StyleSheet, TouchableNativeFeedback, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getAccountType } from "../utils/getStorageData";
import { Scanner, Ticket, Fastpass, Queue } from "../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { dateFormat } from "../utils/dateFormat";
import getURL from "../utils/getURL";

const HomeScreen = ({ route }: { route: any }) => {
    const navigation: any = useNavigation();
    const [types, setTypes] = useState("");
    const [email, setEmail] = useState("");
    const [picture, setPicture] = useState("");

    const fetchImg = () =>
        fetch(getURL() + "profilepic?email=" + email).then(async (response) => {
            const picture: string = await response.text();
            // console.log(picture);
            return picture;
        });

    useEffect(() => {
        getAccountType("email").then((email: string | null) => {
            if (email) {
                setEmail(email);
                fetchImg().then((picture: string) => {
                    setPicture(picture);
                });
            }
        });
        getAccountType("types").then((types: string | null) => {
            if (types) {
                const thaiTypes = types === "พนักงานตรวจสอบบัตรผ่านประตู" ? types : `พนักงานประจำเครื่องเล่น${types}`;
                setTypes(thaiTypes);
            }
        });
    }, []);

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
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>{email}</Text>
                        <Text style={{ fontSize: 15, color: "#3E3D3D" }}>{types}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 4.5, rowGap: 15 }}>
                <Text style={{ fontSize: 20, marginLeft: 40, fontWeight: "600" }}>Menu</Text>
                <TouchableNativeFeedback
                    onPress={() => {
                        navigation.navigate("Scanner");
                    }}
                >
                    <View style={styles.button_Scanner}>
                        <View style={styles.content_Scanner}>
                            <Scanner size={50} color="#F16B4E" />
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 5 }}>Scanner</Text>
                    </View>
                </TouchableNativeFeedback>
                <View style={{ flexDirection: "row", width: "100%", height: "27%", columnGap: 10 }}>
                    <TouchableNativeFeedback onPress={() => navigation.navigate("Ticket")}>
                        <View style={[styles.button_Ticket, { marginLeft: 40 }]}>
                            <View style={styles.content_Ticket}>
                                <Ticket size={50} color="#448ADC" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Ticket</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => navigation.navigate("Fastpass")}>
                        <View style={styles.button_Ticket}>
                            <View style={styles.content_Fastpass}>
                                <Fastpass size={50} color="#00AD50" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Fastpass</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <TouchableNativeFeedback onPress={() => navigation.navigate("Queue")}>
                    <View style={styles.button_Queue}>
                        <View style={styles.content_Queue}>
                            <Queue size={50} color="#F3C95B" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Queue Fastpass</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            {/* <View style={{ flex: 1 }}></View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button_Scanner: {
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
        borderRadius: 80 / 2,
        borderColor: "#448ADC",
        borderWidth: 4,
        backgroundColor: "#B1CFF1",
        alignItems: "center",
        justifyContent: "center",
    },
    content_Fastpass: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        borderColor: "#00AD50",
        borderWidth: 4,
        backgroundColor: "#C9E9D8",
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
});
export default HomeScreen;
